"use client"

import * as React from "react";
import Image from "next/image";
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

// UI Components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/Navbar";
import Create from "./Create";


export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Navbar />
      <main className="flex justify-center w-full pt-8">
          <div className="w-full max-w-6xl px-8">
            <Create />
          </div>
      </main>
    </div>
  );
}
