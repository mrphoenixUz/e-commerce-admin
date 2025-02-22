import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Package, Users } from "lucide-react";
import Link from 'next/link';

const WelcomePage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg"><Link href={'products'}>Go to products page</Link></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and publish a new product listing
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg"><Link href={'categories'}>Go to categories page</Link></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage categories
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg"><Link href={'users'}>View Users</Link></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See all users list
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;