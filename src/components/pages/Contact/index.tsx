'use client';

import React from "react";
import Navbar from "../Home/Nav";
import { ContactRound, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Footer from "../Home/Footer";

const ContactUsComponent = () => {

    return(
        <React.Fragment>
            <Navbar/>
            <div className="container mx-auto px-4 py-16 min-h-[70vh] flex flex-col items-center justify-center">
                <div className="bg-white/90 rounded-lg shadow-lg max-w-2xl w-full p-8 mb-10 mt-16 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-real-600 rounded-full p-4 shadow-lg">
                    <ContactRound className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-4 mt-8">
                    Contact Us
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                    Have questions or want to get in touch? Fill out the form below and our team will get back to you soon.
                    </p>
                    <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-navy-800 mb-1 font-medium">
                        Name
                        </label>
                        <Input id="name" name="name" type="text" placeholder="Your Name" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-navy-800 mb-1 font-medium">
                        Email
                        </label>
                        <Input id="email" name="email" type="email" placeholder="you@email.com" required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-navy-800 mb-1 font-medium">
                        Message
                        </label>
                        <Textarea id="message" name="message" placeholder="How can we help you?" required />
                    </div>
                    <Button className="bg-real-600 hover:bg-real-700 text-white w-full mt-2" type="submit">
                        Send Message
                    </Button>
                    </form>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-lg shadow flex flex-col md:flex-row items-center justify-between px-8 py-6 gap-4">
                    <div className="flex items-center gap-3">
                    <Mail className="text-real-600" />
                    <div>
                        <h3 className="text-sm font-semibold text-navy-900">Email</h3>
                        <span className="text-gray-600">contact@abode.com</span>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <User className="text-real-600" />
                    <div>
                        <h3 className="text-sm font-semibold text-navy-900">Phone</h3>
                        <span className="text-gray-600">+1 (555) 123-4567</span>
                    </div>
                    </div>
                </div>
            </div>
            
            <Footer/>

        </React.Fragment>
    );
}

export default ContactUsComponent;