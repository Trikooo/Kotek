"use client";

import { LinkIcon, MapPin, MessageCircle, Phone, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StoreLayout from "../store/StoreLayout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <StoreLayout>
      <div className="min-h-screen relative">
        {/* Grid Background */}
        <div className="absolute inset-0 w-full h-full" />

        {/* Content remains the same */}
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          {/* Logo */}
          <div className="flex justify-center mb-14">
            <Image src={"/kotek.png"} alt={"Kotek"} width={150} height={150} />
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Contact our friendly team
            </h1>
            <p className="text-lg text-gray-600">
              Let us know how we can help.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <Card>
              <CardContent className="p-6">
                <MessageCircle className="h-6 w-6 mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-lg mb-2">Email us</h3>
                <p className="text-gray-600 mb-4">We&apos;re here to help.</p>
                <Button variant="link" className="p-0 hover:text-indigo-600">
                  <Link href="mailto:kotek.informatique@gmail.com">
                    kotek.informatique@gmail.com
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <MapPin className="h-6 w-6 mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-lg mb-2">Visit us</h3>
                <p className="text-gray-600 mb-4">Visit our store</p>
                <Button variant="link" className="p-0 hover:text-indigo-600">
                  <Link href="https://www.google.dz/maps/place/KOTEK+INFORMATIQUE/@36.714594,2.9957464,17z/data=!3m1!4b1!4m6!3m5!1s0x128faf002a675c55:0x8cedb83e38aed42d!8m2!3d36.714594!4d2.9983213!16s%2Fg%2F11vwwcf8vt?hl=fr&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D">
                    View on Google Maps
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Phone className="h-6 w-6 mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-lg mb-2">Call us</h3>
                <p className="text-gray-600 mb-4">Sat-Thur from 10am to 5pm.</p>
                <Button variant="link" className="p-0 hover:text-indigo-600">
                  <Link href="tel:0659865119">0659 86 51 19</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
