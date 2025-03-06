import React from "react";
import Constrict from "@/app/components/layout/Constrict";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";
import Image from "next/image";
import { WeaponImage } from "@/app/components/cosmetic/WeaponImageFromString";

type WeaponKey =
  | "knife"
  | "m2-carbon"
  | "m10-brat"
  | "shiv"
  | "duster-rx6"
  | "m17-bouncer"
  | "m25-hornet"
  | "buzzsaw-rt40"
  | "m49-fury"
  | "tempest"
  | "berserker-rb3"
  | "blackout"
  | "m67-reaver"
  | "harpe"
  | "trident"
  | "whisper"
  | "m18-drummer"
  | "cyclone"
  | "crusader"
  | "prototype-op";

type WeaponType =
  | "Sniper"
  | "SMG"
  | "Shotgun"
  | "Pistol"
  | "LMG"
  | "Melee"
  | "AR";

type WeaponPenetration = "none" | "low" | "mid" | "high";

interface DamageProfile {
  head?: number;
  body?: number;
  legs?: number;
  front?: number;
  back?: number;
  side?: number;
}

interface WeaponStats {
  name: string;
  type: WeaponType;
  cost: number;
  penetration: WeaponPenetration;
  magazineSize: number;
  fireRate: number;
  runSpeed: number;
  reloadTime: number;
  damage: {
    [range: string]: DamageProfile;
  };
}

const weaponDataMap: Record<WeaponKey, WeaponStats> = {
  knife: {
    name: "Knife",
    type: "Melee",
    cost: 0,
    penetration: "none",
    magazineSize: 0,
    fireRate: 0,
    runSpeed: 6,
    reloadTime: 0,
    damage: {
      "0-5m": { front: 50, back: 150, side: 50 },
    },
  },
  "m2-carbon": {
    name: "M2 Carbon",
    type: "Pistol",
    cost: 0,
    penetration: "mid",
    magazineSize: 12,
    fireRate: 352,
    runSpeed: 5.04,
    reloadTime: 1.8,
    damage: {
      "0-25m": { head: 74, body: 26, legs: 22 },
      "25m+": { head: 66, body: 22, legs: 18 },
    },
  },
  "m10-brat": {
    name: "M10 Brat",
    type: "Pistol",
    cost: 200,
    penetration: "mid",
    magazineSize: 12,
    fireRate: 900,
    runSpeed: 5.04,
    reloadTime: 2.3,
    damage: {
      "0-25m": { head: 49, body: 21, legs: 19 },
      "25m+": { head: 34, body: 19, legs: 18 },
    },
  },
  shiv: {
    name: "Shiv",
    type: "Pistol",
    cost: 200,
    penetration: "mid",
    magazineSize: 12,
    fireRate: 405,
    runSpeed: 5.35,
    reloadTime: 1.7,
    damage: {
      "0-12m": { head: 100, body: 33, legs: 26 },
      "0-25m": { head: 74, body: 26, legs: 22 },
      "25m+": { head: 66, body: 22, legs: 19 },
    },
  },
  "duster-rx6": {
    name: "Duster RX6",
    type: "Pistol",
    cost: 500,
    penetration: "mid",
    magazineSize: 6,
    fireRate: 150,
    runSpeed: 5.04,
    reloadTime: 2.3,
    damage: {
      "0-25m": { head: 160, body: 55, legs: 47 },
      "25m+": { head: 145, body: 50, legs: 43 },
    },
  },
  "m17-bouncer": {
    name: "M17 Bouncer",
    type: "Shotgun",
    cost: 500,
    penetration: "low",
    magazineSize: 5,
    fireRate: 60,
    runSpeed: 4.36,
    reloadTime: 4.2,
    damage: {
      "0-8m": { head: 44, body: 22, legs: 19 },
      "8-12m": { head: 34, body: 17, legs: 14 },
      "12m+": { head: 18, body: 9, legs: 8 },
    },
  },

  "m25-hornet": {
    name: "M25 Hornet",
    type: "SMG",
    cost: 500,
    penetration: "low",
    magazineSize: 25,
    fireRate: 750,
    runSpeed: 4.75,
    reloadTime: 2.0,
    damage: {
      "0-25m": { head: 67, body: 29, legs: 23 },
      "25m+": { head: 62, body: 24, legs: 22 },
    },
  },
  "buzzsaw-rt40": {
    name: "Buzzsaw RT40",
    type: "SMG",
    cost: 800,
    penetration: "low",
    magazineSize: 40,
    fireRate: 840,
    runSpeed: 4.75,
    reloadTime: 2.3,
    damage: {
      "0-20m": { head: 62, body: 25, legs: 25 },
      "20m+": { head: 49, body: 24, legs: 24 },
    },
  },
  "m49-fury": {
    name: "M49 Fury",
    type: "LMG",
    cost: 1100,
    penetration: "high",
    magazineSize: 50,
    fireRate: 525,
    runSpeed: 4.5,
    reloadTime: 2.5,
    damage: {
      "0-30m": { head: 62, body: 38, legs: 33 },
      "30m+": { head: 56, body: 33, legs: 31 },
    },
  },
  tempest: {
    name: "Tempest",
    type: "AR",
    cost: 1300,
    penetration: "high",
    magazineSize: 12,
    fireRate: 300,
    runSpeed: 4.5,
    reloadTime: 2.5,
    damage: {
      "0-15m": { head: 250, body: 65, legs: 49 },
      "15-30m": { head: 203, body: 50, legs: 33 },
      "30m+": { head: 156, body: 41, legs: 31 },
    },
  },
  "berserker-rb3": {
    name: "Berserker RB3",
    type: "AR",
    cost: 1700,
    penetration: "high",
    magazineSize: 75,
    fireRate: 600,
    runSpeed: 4.5,
    reloadTime: 5.1,
    damage: {
      "0-20m": { head: 75, body: 45, legs: 37 },
      "20m+": { head: 62, body: 38, legs: 31 },
    },
  },
  blackout: {
    name: "Blackout",
    type: "AR",
    cost: 2400,
    penetration: "high",
    magazineSize: 25,
    fireRate: 680,
    runSpeed: 4.77,
    reloadTime: 2.5,
    damage: {
      "0-15m": { head: 140, body: 35, legs: 30 },
      "15m+": { head: 124, body: 31, legs: 26 },
    },
  },
  "m67-reaver": {
    name: "M67 Reaver",
    type: "AR",
    cost: 2400,
    penetration: "high",
    magazineSize: 25,
    fireRate: 550,
    runSpeed: 4.5,
    reloadTime: 2.1,
    damage: {
      "0m+": { head: 156, body: 39, legs: 33 },
    },
  },
  harpe: {
    name: "Harpe",
    type: "Sniper",
    cost: 700,
    penetration: "high",
    magazineSize: 5,
    fireRate: 90,
    runSpeed: 4.36,
    reloadTime: 2.0,
    damage: {
      "0m+": { head: 202, body: 101, legs: 85 },
    },
  },
  trident: {
    name: "Trident",
    type: "AR",
    cost: 800,
    penetration: "high",
    magazineSize: 18,
    fireRate: 760,
    runSpeed: 4.5,
    reloadTime: 2.3,
    damage: {
      "0m+": { head: 116, body: 33, legs: 30 },
    },
  },
  whisper: {
    name: "Whisper",
    type: "SMG",
    cost: 900,
    penetration: "low",
    magazineSize: 25,
    fireRate: 666,
    runSpeed: 5.04,
    reloadTime: 2,
    damage: {
      "0-20m": { head: 78, body: 28, legs: 24 },
      "20m+": { head: 62, body: 25, legs: 22 },
    },
  },
  "m18-drummer": {
    name: "M18 Drummer",
    type: "Shotgun",
    cost: 1100,
    penetration: "high",
    magazineSize: 18,
    fireRate: 160,
    runSpeed: 4.36,
    reloadTime: 3.3,
    damage: {
      "0-10m": { head: 25, body: 15, legs: 11 },
      "10-15m": { head: 17, body: 10, legs: 7 },
      "15m+": { head: 14, body: 8, legs: 5 },
    },
  },
  cyclone: {
    name: "Cyclone",
    type: "AR",
    cost: 1200,
    penetration: "high",
    magazineSize: 30,
    fireRate: 590,
    runSpeed: 4.5,
    reloadTime: 2.5,
    damage: {
      "0-15m": { head: 140, body: 35, legs: 33 },
      "15-30m": { head: 124, body: 33, legs: 26 },
      "30m+": { head: 116, body: 30, legs: 25 },
    },
  },
  crusader: {
    name: "Crusader",
    type: "AR",
    cost: 2200,
    penetration: "high",
    magazineSize: 30,
    fireRate: 666,
    runSpeed: 4.5,
    reloadTime: 2.5,
    damage: {
      "0-15m": { head: 140, body: 39, legs: 33 },
      "15-30m": { head: 126, body: 34, legs: 30 },
      "30m+": { head: 120, body: 31, legs: 26 },
    },
  },
  "prototype-op": {
    name: "Prototype OP",
    type: "Sniper",
    cost: 5000,
    penetration: "high",
    magazineSize: 5,
    fireRate: 33,
    runSpeed: 4.36,
    reloadTime: 2.0,
    damage: {
      "0m+": { head: 255, body: 150, legs: 124 },
    },
  },
};

const formatWeaponName = (key: string): string => {
  return key
    .split("-")
    .map((word) =>
      word.length <= 2
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export default async function WeaponPage({
  params,
}: {
  params: Promise<{ weapon: string }>;
}) {
  const weapon = (await params).weapon as WeaponKey;

  if (!(weapon in weaponDataMap)) {
    return <p>Invalid weapon</p>;
  }

  const weaponData = weaponDataMap[weapon];
  const weaponType = weaponData.type;

  const weaponAttributes = [
    { label: "Cost", value: weaponData.cost },
    { label: "Class", value: weaponData.type },
    { label: "Magazine Size", value: weaponData.magazineSize },
    { label: "Fire rate", value: weaponData.fireRate },
    { label: "Run speed", value: weaponData.runSpeed },
    { label: "Reload Time", value: weaponData.reloadTime },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="w-full relative bg-input -mt-4">
          <Constrict className="h-full flex flex-col justify-center">
            <div className="flex flex-col justify-center py-12">
              <div className="flex space-x-2">
                <h1 className="text-secondary-foreground">{weaponData.name}</h1>
              </div>
              <div className="flex justify-start items-start text-input-foreground divide-x divide-primary-foreground/25">
                <p className="pr-3">Class // {weaponType}</p>
                {weaponData.penetration != "none" && (
                  <p className="pl-3">
                    Penetration //{" "}
                    {weaponData.penetration[0].toUpperCase() +
                      weaponData.penetration.slice(1)}
                  </p>
                )}
              </div>
            </div>
          </Constrict>
          <Extrusion
            className="border-primary min-w-[25%] hidden sm:block absolute bottom-0 right-0"
            cornerLocation={CornerLocation.TopLeft}
          />
        </div>
        <div className="w-full">
          <Constrict className="flex flex-col items-start justify-start px-2 sm:px-0 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 py-8 w-full">
              <div className="rounded-primary aspect-square">
                <WeaponImage weapon={`[${weaponType}] ${weaponData.name}`} />
              </div>
              <div className="flex flex-col w-full space-y-8">
                <div className="w-full flex flex-col">
                  <Extrusion
                    className="border-secondary min-w-[35%] rounded-tl-primary"
                    cornerLocation={CornerLocation.TopRight}
                  />
                  <div className="w-full aspect-video bg-secondary rounded-primary rounded-tl-none p-4 space-y-2">
                    <h3>Stats</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {weaponAttributes.map((attribute) => (
                        <div
                          key={attribute.label}
                          className="space-y-1 bg-white/5 p-2 corner-clip-sm rounded-primary"
                        >
                          <p className="text-accent">{attribute.label}</p>
                          <p className="text-lg">{attribute.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col">
                  <div className="w-full bg-secondary rounded-primary rounded-tl-none p-4">
                    <h3>Damage</h3>
                    <div className="flex flex-col w-full space-y-4 mt-4">
                      {Object.entries(weaponData.damage).map(
                        ([range, values]) => (
                          <div key={range} className="w-full">
                            <h4 className="mx-auto text-start">{range}</h4>
                            <div className="flex gap-x-2">
                              {Object.entries(values).map(
                                ([part, damageValue]) => (
                                  <div
                                    key={part}
                                    className="w-full py-2 bg-white/5 rounded-primary corner-clip-sm items-center flex flex-col"
                                  >
                                    <p className="text-sm text-accent">
                                      {part.charAt(0).toUpperCase() +
                                        part.slice(1)}
                                    </p>
                                    <p className="text-xl"> {damageValue}</p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <Extrusion
                    className="border-secondary ml-auto min-w-[35%] rounded-tl-primary"
                    cornerLocation={CornerLocation.BottomLeft}
                  />
                </div>
              </div>
            </div>
            <h2>{weaponData.name} Weapon Skins</h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="p-2 bg-secondary rounded-primary flex flex-col"
                >
                  <div className="w-full aspect-video bg-accent/5 mb-2 rounded-primary"></div>
                  <h3>
                    {index + 1} {weaponData.name}
                  </h3>
                  <p className="text-input-foreground">Cost // 1000 SP</p>
                </div>
              ))}
            </div>
          </Constrict>
        </div>
      </div>
    </div>
  );
}
