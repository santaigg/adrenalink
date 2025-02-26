"use client";
import { useParams } from "next/navigation";
import Constrict from "@/app/components/layout/Constrict";
import { SponsorImage } from "@/app/components/cosmetic/SponsorImageFromString";

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

export default function SponsorPage() {
  const params = useParams<{ tag: string; sponsor: string }>();
  const sponsorName = params.sponsor;

  return (
    <Constrict>
      <div className="">
        <h1>{parseSponsorName(sponsorName)}</h1>
        <SponsorImage sponsor={sponsorName} />
      </div>
    </Constrict>
  );
}
