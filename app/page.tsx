"use client"

import * as fabric from "fabric";
import { useState, useEffect, useRef } from "react";

console.log(fabric);

import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleResize, initializeFabric } from "@/lib/canvas";
import { useStorage } from "@/liveblocks.config";
import { useMutation } from "@liveblocks/react";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef<boolean>(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');
  const activeObjectRef = useRef<fabric.Object | null>(null);

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if(!object) return;

    const {objectId} = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);

  }, []);

  const [activeElement, setActiveElement] = 
    useState<ActiveElement>({
      name: "",
      value: "",
      icon: "",
    });

    const handleActiveElement = (elem: ActiveElement) => { 
      setActiveElement(elem) 
      selectedShapeRef.current = elem?.value as string
    }

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    const canvas = initializeFabric({ canvasRef, fabricRef })
    
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        shapeRef,
        isDrawing,
        selectedShapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        shapeRef,
        isDrawing,
        selectedShapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on("mouse:up", (options) => {
      handleCanvasMouseUp({
        canvas,
        shapeRef,
        isDrawing,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({ fabricRef })
    })
  }, [])

  return (
    <main className="h-screen overflow-hidden">
      <Navbar 
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        />
      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
      
    </main>
  );
}