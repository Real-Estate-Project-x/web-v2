"use client";

import Link from "next/link";
import React from "react";
import { AgentInterface } from "../../../../utils/interfaces";
import { Star, MapPin, Mail, PhoneCall, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AgentCardProps {
  agent: AgentInterface;
}

const AgentCard = ({ agent: data }: AgentCardProps) => {
  const agent = data?.agency;
  const firstNameInitials = agent?.name?.split(" ")?.[0];
  const lastNameInitials = agent?.name?.split(" ")?.[1];

  return (
    <div className="relative group h-full">
      {/* Ambient glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 via-transparent to-sky-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

      <div
        className="relative h-full bg-[#0f1c36] border border-blue-700/30 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-blue-500/50"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px" }}
      >
        {/* Top accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative shrink-0">
              {/* Avatar glow */}
              <div
                className={`absolute inset-0 rounded-full blur-md opacity-40 scale-110 ${
                  agent?.status ? "bg-sky-400" : "bg-blue-900"
                }`}
              />
              <Avatar className="relative h-14 w-14 ring-1 ring-blue-700/40">
                <AvatarImage src={agent?.logo} alt={`${agent?.name}`} />
                <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-sky-400 text-white uppercase">
                  {firstNameInitials?.[0]}
                  {lastNameInitials?.[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f1c36] shadow-lg ${
                  agent?.status ? "bg-sky-400 shadow-sky-400/50" : "bg-blue-900"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <h3 className="text-base font-semibold text-white capitalize leading-tight tracking-tight">
                  {agent?.name}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 text-[15px] font-semibold px-2 py-0.5 rounded-full border ${
                    data?.isCurrentlyAvailable
                      ? "bg-sky-400/10 text-sky-300 border-sky-400/20"
                      : "bg-blue-900/30 text-blue-400 border-blue-800/40"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      data?.isCurrentlyAvailable ? "bg-sky-400" : "bg-blue-600"
                    }`}
                  />
                  {data?.isCurrentlyAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p
                className="text-xs text-white/40 mb-2 leading-relaxed"
                style={{ overflowWrap: "break-word" }}
              >
                {agent?.description}
              </p>

              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-sky-400 text-sky-400" />
                <span className="text-xs font-bold text-sky-400">
                  {agent?.rating}
                </span>
                <span className="text-xs text-white/25">
                  ({data?.totalReviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-5" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { value: data?.propertyCount, label: "Properties" },
              { value: data?.viewingsCount, label: "Viewings" },
              { value: data?.timeSinceJoined, label: "Member Since" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center bg-blue-900/30 border border-blue-700/30 rounded-xl py-2.5 px-1"
              >
                <div className="text-sm font-bold text-white capitalize leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/30 leading-none">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-900/30 border border-blue-700/30 flex items-center justify-center shrink-0">
              <MapPin className="h-3 w-3 text-white/40" />
            </div>
            <p
              className="text-xs text-white/40 capitalize"
              style={{ overflowWrap: "break-word" }}
            >
              {agent?.address}
            </p>
          </div>

          {/* Specialties */}
          {data?.propertyTypes?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {data?.propertyTypes.slice(0, 5).map((specialty, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-blue-600/30 bg-blue-800/20 text-blue-200/60 capitalize font-medium"
                >
                  {specialty.name}
                </span>
              ))}
              {data?.propertyTypes.length > 5 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md border border-sky-400/20 bg-sky-400/5 text-sky-400/70 font-medium">
                  +{data.propertyTypes.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-4" />

          {/* Contact + CTA */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
              <span className="text-xs text-white/50">
                {agent?.whatsappNumber}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-3.5 w-3.5 text-white/30 shrink-0" />
                <span className="text-xs text-white/50 truncate">
                  {agent?.email}
                </span>
              </div>

              <Link href={`/agents/properties?id=${agent?.id}`}>
                <button className="shrink-0 group/btn flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400 border border-sky-400/20 hover:border-sky-400 text-sky-400 hover:text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200">
                  View
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
