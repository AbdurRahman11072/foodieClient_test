"use client";

import { motion, Variants } from "framer-motion";
import { CreditCard, Truck, Utensils } from "lucide-react";

const steps = [
  {
    icon: Utensils,
    title: "Choose Your Meal",
    description: "Browse our extensive menu and select your favorite dishes from top-rated restaurants.",
  },
  {
    icon: CreditCard,
    title: "Fast Checkout",
    description: "Pay after you get your order. It's quick, easy, and completely safe.",
  },
  {
    icon: Truck,
    title: "Quick Delivery",
    description: "Sit back and relax. Our delivery partners will bring your food fresh and hot to your doorstep.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
};

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ordering your favorite food has never been this easy. Follow these three simple steps.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/10 to-transparent hover:from-primary/10 hover:via-primary/5 hover:to-transparent transition-all duration-500 border border-secondary/20 hover:border-primary/30 shadow-sm hover:shadow-xl group"
            >
              {/* Step Number Badge */}
              {/* <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </div> */}

              {/* Icon Container */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <step.icon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
