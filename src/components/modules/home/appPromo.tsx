"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";

export default function AppPromo() {
  return (
    <section className="py-16 md:py-24 bg-primary/5 overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Get more with the <br className="hidden lg:block" />
              <span className="text-primary">Foodie App</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Download our mobile app to unlock exclusive discounts, track your delivery in real-time, and order your favorite meals with just a tap.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 rounded-full text-base">
                <Apple className="w-6 h-6" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none opacity-80">Download on the</span>
                  <span className="font-semibold leading-none mt-1">App Store</span>
                </div>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-14 px-8 rounded-full text-base border-2 hover:bg-secondary/50">
                <Play className="w-6 h-6" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none opacity-80">GET IT ON</span>
                  <span className="font-semibold leading-none mt-1">Google Play</span>
                </div>
              </Button>
            </div>
          </motion.div>

          {/* Image/Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-md lg:max-w-none mx-auto"
          >
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl z-0"></div>

            {/* Mockup Frame (CSS based for placeholder) */}
            <div className="relative z-10 mx-auto w-[280px] h-[580px] bg-foreground rounded-[40px] shadow-2xl p-2 border-[6px] border-secondary overflow-hidden flex flex-col">
               {/* Notch */}
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-secondary rounded-b-xl z-20"></div>
               {/* Screen Content Mockup */}
               <div className="w-full h-full bg-background rounded-[30px] overflow-hidden flex flex-col">
                  {/* Fake Header */}
                  <div className="h-48 bg-primary/10 relative p-6 pt-12">
                    <div className="w-10 h-10 rounded-full bg-primary/20 mb-4"></div>
                    <div className="h-6 w-32 bg-primary/20 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                  {/* Fake Body */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="h-32 w-full bg-secondary/30 rounded-xl"></div>
                    <div className="flex gap-4">
                      <div className="h-24 flex-1 bg-secondary/30 rounded-xl"></div>
                      <div className="h-24 flex-1 bg-secondary/30 rounded-xl"></div>
                    </div>
                    <div className="h-16 w-full bg-primary/20 rounded-xl mt-auto"></div>
                  </div>
               </div>
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-12 -left-8 md:-left-12 bg-background p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-border"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <span className="text-xl">🛵</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Under 30 mins</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
