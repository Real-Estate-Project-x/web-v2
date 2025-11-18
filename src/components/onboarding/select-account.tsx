'use client';

import { ArrowRight, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { StepSetUpForOnboarding } from "../shared";
import { usePathname } from "next/navigation";

export const SelectAccountTypeOnboarding = () => {
    const pathname = usePathname();

    return(
        <div className="w-full h-screen bg-white/30 flex justify-center items-start pt-20">
            <div className="w-11/12 sm:w-10/12">
               <StepSetUpForOnboarding pathname={pathname} type=""/>

               <div className="w-full mx-auto p-6 text-center">
                    <h1 className="text-4xl font-semibold mb-4">Select Account Type</h1>
                    <p className="text-lg">Select the account type that best fits your needs</p>

                    <div className="w-full grid md:grid-cols-2 gap-6 my-12">
                        <div className="w-[90%] border bg-white rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition p-10 text-left cursor-pointer">
                           <User className="w-7 h-7"/>
                           <h2 className="text-xl font-semibold py-4">User</h2>

                           <p className="text-sm text-gray-800 font-thin">Perfect for individuals looking to explore and benefit from the platform's services.</p>

                           <ul className="list-none text-gray-800 font-thin text-sm my-4 space-y-2">
                            <li>Access to all basic features</li>
                            <li>Personalized dashboard</li>
                            <li>Priority customer support</li>
                            <li>Regular updates and improvements</li>
                           </ul>

                            <Link href={'/signUp?type=USER'} className="text-black text-sm font-medium mt-4">
                                <span>
                                    Proceed as User
                                    <ArrowRight className="inline-block ml-2 w-4 h-4"/>
                                </span>
                            </Link>
                        
                        </div>

                        <div className="w-[90%] border bg-white rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition p-10 text-left cursor-pointer">
                           <Briefcase className="w-7 h-7"/>
                           <h2 className="text-xl font-semibold py-4">Agent</h2>

                           <p className="text-sm text-gray-800 font-thin">Designed for professionals who want to provide services and manage operations.</p>

                           <ul className="list-none text-gray-800 font-thin text-sm my-4 space-y-2">
                            <li>Advanced management tools</li>
                            <li>Analytics and insights</li>
                            <li>Client relationship features</li>
                            <li>Revenue tracking dashboard</li>
                           </ul>
                        

                            <Link href='/signUp?type=AGENT' className="text-black text-sm font-medium mt-4">
                                <span>
                                    Proceed as Agent
                                    <ArrowRight className="inline-block ml-2 w-4 h-4"/>
                                </span>
                            </Link>
                        </div>
                       
                    </div>
               </div>
            </div>
        </div>
    );
}