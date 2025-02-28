"use client";
import { useParams, useSearchParams } from "next/navigation";
import Constrict from "@/app/components/layout/Constrict";
import { SponsorImage, AbilityImage } from "@/app/components/cosmetic/SponsorImageFromString";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";
import { useEffect, useState } from "react";

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

type SponsorKey =
  | "pinnacle"
  | "morrgen"
  | "bloom"
  | "ryker"
  | "vector"
  | "ghostlink"
  | "muu"
  | "umbra"
  | "monark";

type AbilityInfo = {
  ability: string;
  description: string;
  cost: number;
};

type SponsorInfo = {
  sponsor_id: string;
  role: string;
  district: string;
  abilities: {
    q: AbilityInfo;
    e: AbilityInfo;
    c: AbilityInfo;
  };
};

const sponsorsInfo: Record<SponsorKey, SponsorInfo> = {
  pinnacle: {
    sponsor_id: "pinnacle",
    role: "Assault",
    district: "Five Stars",
    abilities: {
      q: {
        ability: "Splinter Grenade",
        description:
          "Throw a grenade that explodes into splinters, each dealing damage.",
        cost: 100,
      },
      e: {
        ability: "Adrena-Link",
        description:
          "Instantly equip a Spectre-linked stim that heals you. While healing, you can switch to your Spectre to gain enhanced vision and movespeed.",
        cost: 150,
      },
      c: {
        ability: "Flash Grenade",
        description:
          "Throw a grenade that explodes and blinds all players in line of sight. ALT FIRE: An underhand throw that explodes.",
        cost: 80,
      },
    },
  },
  morrgen: {
    sponsor_id: "morrgen",
    role: "Disruptor",
    district: "Moongate",
    abilities: {
      q: {
        ability: "Smoke Shift",
        description:
          "Throw a grenade that creates a cloud of smoke. ALT FIRE: Throw a smoke grenade and your Puck at the same time. Enemies cannot see your Puck’s recall line.",
        cost: 90,
      },
      e: {
        ability: "Meltdown",
        description:
          "Throw a grenade that creates an area of caustic fluid and damages players health over time.",
        cost: 130,
      },
      c: {
        ability: "Hidden Grasp",
        description:
          "Deploy a trap that cloaks itself after deployment. Explodes if an enemy gets too close, creating a slow zone for a set amount of time.",
        cost: 110,
      },
    },
  },
  bloom: {
    sponsor_id: "bloom",
    role: "Support",
    district: "Greenbelt",
    abilities: {
      q: {
        ability: "Hex Barrier",
        description:
          "Deploy a barrier that blocks bullets. Each section of the barrier has some health.",
        cost: 120,
      },
      e: {
        ability: "Twin Mend",
        description:
          "Heal a damaged ally and their Spectre over time. ALT FIRE: If damaged, heal yourself and your Spectre for some health over time.",
        cost: 140,
      },
      c: {
        ability: "Swarm Grenade",
        description:
          "Throw a grenade that releases a swarm of bees for a set amount of time. The swarm blocks vision and deals damage to enemies inside it.",
        cost: 100,
      },
    },
  },
  ryker: {
    sponsor_id: "ryker",
    role: "Recon",
    district: "Port",
    abilities: {
      q: {
        ability: "Wave Scan",
        description:
          "Throw a sonar spike that pulses towards your active body. Enemies hit by a pulse will be located for a short amount of time. ALT FIRE: The sonar spike will bounce once before sticking.",
        cost: 110,
      },
      e: {
        ability: "Hull Mine",
        description:
          "After a short delay, the first enemy who gets too close will trigger several explosions, each of which deals damage.",
        cost: 125,
      },
      c: {
        ability: "Arc Sentry",
        description:
          "Deploys a sentry that slows enemies who get within its line of sight.",
        cost: 140,
      },
    },
  },
  vector: {
    sponsor_id: "vector",
    role: "Assault",
    district: "Emerald",
    abilities: {
      q: {
        ability: "Dual Amp",
        description:
          "Deploy a marker and gain an increased fire rate buff for a short amount of time. Reactivate to teleport your Spectre to the marker, giving it a fire rate buff. Kills reset the buff duration.",
        cost: 130,
      },
      e: {
        ability: "Vector Wall",
        description:
          "Deploy a slow moving nanobot wall that blocks vision. ALT FIRE: The wall moves faster and lasts for a shorter amount of time.",
        cost: 150,
      },
      c: {
        ability: "Nano Sphere",
        description:
          "Deploy a bouncing nano swarm that deals damage over time to the first enemy it gets near.",
        cost: 110,
      },
    },
  },
  ghostlink: {
    sponsor_id: "ghostlink",
    role: "Disruptor",
    district: "Communa",
    abilities: {
      q: {
        ability: "Partition",
        description:
          "Deploy a barrier that blocks line of sight. The wall is not stopped by terrain and touching the wall slightly blurs vision.",
        cost: 100,
      },
      e: {
        ability: "Dupe",
        description:
          "Instantly deploy a dupe of your current body that lasts a few seconds. Additionally, leave a dupe behind you for a set of time when you Puck Throw if you have a charge remaining. Enemies who shoot dupes are revealed for a short amount of time.",
        cost: 120,
      },
      c: {
        ability: "Dead Zone",
        description:
          "Throw a grenade that creates a large distortion field and blurs the vision of all player's inside.",
        cost: 140,
      },
    },
  },
  muu: {
    sponsor_id: "muu",
    role: "Support",
    district: "Communa",
    abilities: {
      q: {
        ability: "Patches",
        description:
          "Deploy a drone that moves forward and heals you and allies in its radius for health over time. ALT FIRE: The drone remains stationary.",
        cost: 110,
      },
      e: {
        ability: "Dazzler",
        description:
          "Deploy a flying drone that follows your crosshair. After a short duration, the drone explodes and obscures the vision of any enemies in line of sight.",
        cost: 90,
      },
      c: {
        ability: "Hyper Dome",
        description:
          "Throw a grenade that creates a permanent Fast Recall Zone and a breakable health shield dome on floor impact.",
        cost: 150,
      },
    },
  },
  umbra: {
    sponsor_id: "umbra",
    role: "Recon",
    district: "Shadows",
    abilities: {
      q: {
        ability: "Recon Wing",
        description:
          "Throw a drone that sticks to the first surface it hits. After a second the drone reveals enemies within range for a short amount of time. TARGET MARKER: Instantly create an AoE at the marker that reveals enemies.",
        cost: 120,
      },
      e: {
        ability: "Pulsefinder",
        description:
          "Instantly equip a scanner that pulses every couple of seconds for a set amount of time. Enemies hit are detected and leave a marker at their location. Detected enemies can see the remaining pulses.",
        cost: 100,
      },
      c: {
        ability: "Glare Burst",
        description:
          "Deploy a drone that charges for a few seconds and then temporarily blinds all players in its AoE. TARGET MARKER: Instantly create an AoE at the marker that temporarily blinds all players for a short amount of time.",
        cost: 130,
      },
    },
  },
  monark: {
    sponsor_id: "monark",
    role: "Assault",
    district: "Shadows",
    abilities: {
      q: {
        ability: "Sovereign Shell",
        description:
          "Instantly protects you with a shield that slows you over time, and lasts 5 seconds. Reactivate it to end early.",
        cost: 140,
      },
      e: {
        ability: "Crosswall",
        description:
          "Deploy a T-shaped wall that blocks vision. Aim towards the ground to deploy closer.ALT FIRE: If Crosswall is prepared on your Spectre, deploy the wall from your Spectre instead.",
        cost: 130,
      },
      c: {
        ability: "Siphon",
        description:
          "Fire a wave of energy. Enemies hit are temporarily drained health. If at least one enemy is hit, you and your Spectre gain health (and can overheal).",
        cost: 120,
      },
    },
  },
};

const tabs = [
  { title: "Abilities" },
  { title: "Information" },
  { title: "Stats" },
];

export function StatsTabItem({ title, data }: { title: string; data: string }) {
  return (
    <div className="flex flex-col items-start justify-start min-w-36">
      <p className="text-sm text-input-foreground">{title}</p>
      <p className="text-xl font-medium">{data}</p>
    </div>
  );
}
export default function SponsorPage() {
  const params = useParams<{ tag: string; sponsor: string }>();
  const sponsorName = params.sponsor as SponsorKey;
  const sponsorInfo = sponsorsInfo[sponsorName] ?? null;

  const [activeTab, setActiveTab] = useState<string>("Abilities");
  const [activeAbility, setActiveAbility] = useState<string>(
    sponsorInfo.abilities.q.ability
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Abilities":
        return (
          <>
            <h2>Abilities</h2>
            <div className="w-full flex flex-col space-y-4 mt-2">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                {Object.entries(sponsorInfo.abilities).map(([key, ability]) => (
                  <div
                    key={key}
                    className={`border-t p-4 corner-clip w-full flex items-start justify-start space-x-4 cursor-pointer hover:-translate-y-1 transition-all ${
                      activeAbility == ability.ability
                        ? "border-accent/15 bg-primary-foreground/5"
                        : "border-primary-foreground/15 bg-secondary hover:bg-primary-foreground/5"
                    }`}
                    onClick={() => setActiveAbility(ability.ability)}
                  >
                    <div className="shrink-0">
                      <div className="w-10 h-10 flex justify-center items-center">
                        <AbilityImage
                          sponsor={sponsorInfo.sponsor_id as SponsorKey}
                          ability={key as "q" | "e" | "c"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start space-y-2">
                      <div className="flex space-x-2 items-center">
                        <p className="px-2 py-0.5 rounded bg-primary-foreground/5">
                          {key.toUpperCase()}
                        </p>
                        <p className="text-lg">{ability.ability}</p>
                      </div>
                      <p>{ability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full aspect-video bg-secondary flex justify-center items-center">
                <p>Video of Selected Ability</p>
              </div>
            </div>
          </>
        );
      case "Information":
        return (
          <>
            <h2>Information</h2>
            <div className="w-full flex flex-col space-y-4 mt-2">
              <p>
                We can put some lore for each sponsor here if we ever get some, like about their district etc.
              </p>
            </div>
          </>
        );
      case "Stats":
        return (
          <>
            <h2>Stats</h2>
            <div className="w-full flex flex-col space-y-4 mt-2">
              <div className="w-full corner-clip bg-secondary p-4 pr-16 flex flex-col space-y-4 border-t border-accent/15">
                <div className="flex flex-wrap flex-col space-y-2">
                  <StatsTabItem title="Pick Rate" data="19.2%" />
                  <div className="w-full h-1 bg-primary-foreground/15 rounded relative">
                    <div
                      className="absolute top-0 left-0 bg-accent h-full"
                      style={{ width: `${19.2}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col space-y-2">
                  <StatsTabItem title="Win Rate" data="56%" />
                  <div className="w-full h-1 bg-primary-foreground/15 rounded relative">
                    <div
                      className="absolute top-0 left-0 bg-accent h-full"
                      style={{ width: `${56}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-wrap space-x-2">
                  <StatsTabItem title="Kills/Match" data="19.2" />
                  <StatsTabItem title="Assists/Match" data="9.4" />
                  <StatsTabItem title="Deaths/Match" data="17.6" />
                  <StatsTabItem title="Damage/Match" data="3645" />
                </div>
                <div className="flex flex-wrap space-x-2">
                  <StatsTabItem title="Kills/Round" data="2.3" />
                  <StatsTabItem title="Assists/Round" data="0.86" />
                  <StatsTabItem title="Deaths/Round" data="1.75" />
                  <StatsTabItem title="Damage/Round" data="256" />
                </div>
                <div className="flex flex-wrap space-x-2">
                  <StatsTabItem title="K/D" data="1.28" />
                </div>
              </div>
            </div>
          </>
        );

      default:
        return <div className="">This tab shouldn't be here...</div>;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full relative bg-input -mt-4">
        <Constrict className="h-full flex flex-col justify-center">
          <div className="flex flex-col justify-center pt-12 pb-6">
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
              <p className="pr-3">District // {sponsorInfo.district}</p>
              <p className="pl-3">Role // {sponsorInfo.role}</p>
            </div>
          </div>
          <div className="flex">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className={`px-2 py-2 hover:bg-secondary transition-all cursor-pointer ${
                    activeTab == tab.title
                      ? "bg-gradient-to-t from-primary to-transparent"
                      : ""
                  } `}
                  onClick={() => setActiveTab(tab.title)}
                >
                  <p>{tab.title}</p>
                </div>
              );
            })}
          </div>
        </Constrict>
        <Extrusion
          className="border-primary min-w-[25%] hidden sm:block absolute bottom-0 right-0"
          cornerLocation={CornerLocation.TopLeft}
        />
      </div>
      <div className="w-full">
        <Constrict className="flex flex-col items-start justify-start px-2 sm:px-0">
          <div className="flex flex-col py-8 w-full">{renderTabContent()}</div>
        </Constrict>
      </div>
    </div>
  );
}
