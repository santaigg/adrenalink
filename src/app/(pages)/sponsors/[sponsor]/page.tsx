"use client";
import { useParams, useSearchParams } from "next/navigation";
import Constrict from "@/app/components/layout/Constrict";
import { SponsorImage } from "@/app/components/cosmetic/SponsorImageFromString";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";
import { useState } from "react";

function parseSponsorName(sponsor: string) {
  switch (sponsor) {
    case "pinnacle": {
      return "Pinnacle International";
    }
    case "morrgen": {
      return "Morrgen United";
    }
    case "bloom": {
      return "Bloom Technologies";
    }
    case "ryker": {
      return "Ryker Industries";
    }
    case "vector": {
      return "Vector Dynamics";
    }
    case "ghostlink": {
      return "Ghostlink Collective";
    }
    case "muu": {
      return "Muu Robotics";
    }
    case "umbra": {
      return "Umbra Reconnaissance";
    }
    case "monark": {
      return "Monark Tactical";
    }
    default: {
      return "Unknown Sponsor";
    }
  }
}

const tabs = [{ title: "Abilities" }, { title: "Information" }];

export default function SponsorPage() {
  const params = useParams<{ tag: string; sponsor: string }>();
  const sponsorName = params.sponsor;

  const [activeTab, setActiveTab] = useState<string>("Abilities");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Abilities":
        return (
          <>
            <h2>Abilities</h2>
            <p>Q key, C key, E key</p>
          </>
        );
      case "Stats":
        return <div className="">Stats content</div>;
      default:
        return <div className="">Default content</div>;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full relative bg-input py-12">
        <Constrict className="h-full flex flex-col justify-center">
          <div className="flex space-x-2">
            <SponsorImage
              className="w-10 h-10 shrink-0"
              sponsor={sponsorName}
            />
            <h1 className="text-secondary-foreground">
              {parseSponsorName(sponsorName)}
            </h1>
          </div>
          <div className="flex justify-start items-start pl-12 text-input-foreground divide-x divide-primary-foreground/25">
            <p className="pr-3">District // Communa</p>
            <p className="pl-3">Role // Disruptor</p>
          </div>
        </Constrict>
        <Extrusion
          className="border-primary min-w-[25%] hidden sm:block absolute bottom-0 right-0"
          cornerLocation={CornerLocation.TopLeft}
        />
      </div>
      <div className="w-full">
        <Constrict className="flex flex-col items-start justify-start">
          <div className="flex space-x-1 hidden border-b border-secondary">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className={`px-2 py-2 hover:bg-secondary transition-all cursor-pointer ${
                    activeTab == tab.title
                      ? "bg-gradient-to-t from-secondary-foreground/5 to-transparent"
                      : ""
                  } `}
                >
                  <p>{tab.title}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col py-8">{renderTabContent()}</div>
        </Constrict>
      </div>
    </div>
  );
}
