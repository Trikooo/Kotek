"use client";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SettingsLayout from "../SettingsLayout";

export default function SupportPage() {
  const handleCallNow = () => {
    window.location.href = "tel:0659865119";
  };

  const handleSendEmail = () => {
    window.location.href = "mailto:kotek.informatique@gmail.com";
  };

  return (
    <SettingsLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
            <p className="text-sm text-muted-foreground">
              Get in touch with our customer support team
            </p>
          </div>
        </header>

        <div className="px-6 py-6 space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Phone Support</h2>
            <p className="text-sm text-muted-foreground">
              Call us for immediate assistance
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Phone
                  className="w-4 h-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    General Inquiries
                  </p>
                  <p className="text-sm text-muted-foreground pt-1">
                    0659865119
                  </p>
                </div>
              </div>
            </div>
            <Button className="w-full sm:w-auto" onClick={handleCallNow}>
              <Phone className="mr-2 h-4 w-4" strokeWidth={1.5} /> Call Now
            </Button>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Email Support</h2>
            <p className="text-sm text-muted-foreground">
              Send us an email and we&apos;ll get back to you
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail
                  className="w-4 h-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Customer Service
                  </p>
                  <p className="text-sm text-muted-foreground">
                    kotek.informatique@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <Button className="w-full sm:w-auto" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" strokeWidth={1.5} /> Send Email
            </Button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
