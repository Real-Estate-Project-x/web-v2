'use client';

import React, { useRef, useState } from "react";
import Navbar from "../Home/Nav";
import { ContactRound, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Footer from "../Home/Footer";
import { ErrorDialog } from "@/components/shared/error-dialog";
import { SuccessDialog } from "@/components/shared/success-dialog";
import { axiosInstance } from "@/lib/axios-interceptor";

const ContactUsComponent = () => {

    const [state, setState] = useState({
        name : "", email : "", phone : "", message : ""
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [errorMsg, setErrorObj] = useState<{msg : string, flag : boolean}>({msg : "", flag :false});
    const [success, setSuccessObj] = useState<{msg : string, flag : boolean}>({msg : "", flag :false});
    const [loading, setLoader] = useState<boolean>(false);

    const {name, email, phone, message} = state;

    const onChangeNameHandler = (value : string) => {
        setState({...state, name : value});
    }

    const onChangeEmailHandler = (value : string) => {
        setState({...state, email : value});
    }

    const onChangePhoneNumberHandler = (value : string) => {
        setState({...state, phone : value});
    }

    const onChangeMessageHandler = (value : string) => {
        setState({...state, message : value});
    }

    const submitHandler = (e : React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);
        axiosInstance.post(`contact-message`,{
            name,
            //userId: "string",
            email,
            message,
            phoneNumber : phone
        })
        .then((response) => {
            if(response?.data?.success){
                setSuccessObj({...success, msg : "Your Request Has Been Sent Successfully.", flag :true});
                setState({...state, name : "", email : "", phone : "", message : ""});
            }else{
                setErrorObj({...errorMsg, flag : true, msg : response?.data?.message});
            }
            formRef.current?.reset();
            setLoader(false);
        }).catch((err) => {
            setErrorObj({...errorMsg, flag : true, msg : err?.response?.data?.message});
            setLoader(false);
        });

    }
    
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
                    <form className="space-y-4" ref={formRef} onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="name" className="block text-navy-800 mb-1 font-medium">
                        Name
                        </label>
                        <Input id="name" name="name" type="text" placeholder={"Your Name"} defaultValue={name} required 
                            onChange={(e : React.ChangeEvent<HTMLInputElement>) => onChangeNameHandler(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-navy-800 mb-1 font-medium">
                        Email
                        </label>
                        <Input id="email" name="email" type="email" placeholder={"you@email.com"} defaultValue={email} required 
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onChangeEmailHandler(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-navy-800 mb-1 font-medium">
                        Phone&nbsp;Number
                        </label>
                        <Input id="email" name="email" type="text" placeholder={"07097230988"} defaultValue={phone} required  maxLength={11}
                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onChangePhoneNumberHandler(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-navy-800 mb-1 font-medium">
                        Message
                        </label>
                        <Textarea id="message" name="message" placeholder={"How can we help you?"} defaultValue={message} className="h-24" required 
                            onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => onChangeMessageHandler(e.target.value)}
                        />
                    </div>
                    {/* <div className="flex items-stretch"> */}
                    <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white w-full sm:w-1/2 mx-auto mt-2 float-right disabled:cursor-default disabled:bg-gray-500" 
                    type="submit"
                    disabled={loading}>
                        Send Message
                    </Button>
                    {/* </div> */}
                   
                    </form>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-lg shadow flex flex-col md:flex-row items-center justify-between px-8 py-6 gap-4">
                    <div className="flex items-center gap-3">
                    <Mail className="text-real-600" />
                    <div>
                        <h3 className="text-sm font-semibold text-navy-900">Email</h3>
                        <span className="text-gray-600">contact@blupodd.com</span>
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
            <SuccessDialog
                open={success?.flag}
                onOpenChange={() => setSuccessObj({...success, flag : false})}
                description={success.msg}
            />
            <ErrorDialog
                open={errorMsg?.flag}
                onOpenChange={() => setErrorObj({...errorMsg, flag : false})}
                description={errorMsg.msg}
            />
        </React.Fragment>
    );
}

export default ContactUsComponent;