"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Link2Off, LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FaDiscord } from "react-icons/fa";
import GoogleIcon from "@/components/icons/Google";

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 mx-0 lg:mx-32">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <Button disabled={isLoading} size="sm">
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <span className="text-sm text-muted-foreground">
            JPG or PNG. Max size of 1MB
          </span>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <Camera
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
              </AvatarFallback>
            </Avatar>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Upload New
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-500 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
        <Separator />

        {/* Username Section */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" className="w-full" />
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            className="w-full"
          />
          <Button variant="link" className="h-auto p-0 text-sm">
            Resend verification email
          </Button>
        </div>
        <Separator />

        {/* Linked Accounts Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Linked Accounts</h3>
          <div className="space-y-4">
            {/* Google Account */}
            <div className="flex items-center justify-between w-full p-4">
              <div className="flex items-center space-x-4">
                <GoogleIcon className="w-4 h-4" />
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-500 hover:bg-red-50"
              >
                <Link2Off className="mr-2 w-4 h-4" strokeWidth={1.5} />
                Unlink
              </Button>
            </div>

            {/* Discord Account */}
            <div className="flex items-center justify-between w-full p-4">
              <div className="flex items-center space-x-4">
                <FaDiscord className="text-discordBlue" />
                <div>
                  <p className="font-medium">Discord</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <LinkIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
