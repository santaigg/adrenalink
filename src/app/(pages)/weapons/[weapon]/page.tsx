import React from "react";
import Constrict from "@/app/components/layout/Constrict";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";

function parseWeaponName(weapon: string) {
  return weapon
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function WeaponPage({
  params,
}: {
  params: Promise<{ weapon: string }>;
}) {
  const weapon = (await params).weapon;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="w-full relative bg-input -mt-4">
          <Constrict className="h-full flex flex-col justify-center">
            <div className="flex flex-col justify-center py-12">
              <div className="flex space-x-2">
                <h1 className="text-secondary-foreground">
                  {parseWeaponName(weapon)}
                </h1>
              </div>
              <div className="flex justify-start items-start text-input-foreground divide-x divide-primary-foreground/25">
                <p className="pr-3">Class // Sidearm</p>
                <p className="pl-3">Penetration // Mid</p>
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
              <div className="bg-red-500/15 rounded-primary aspect-square"></div>
              <div className="flex flex-col w-full space-y-8">
                <div className="w-full flex flex-col">
                  <Extrusion
                    className="border-secondary min-w-[35%] rounded-tl-primary"
                    cornerLocation={CornerLocation.TopRight}
                  />
                  <div className="w-full aspect-video bg-secondary rounded-primary rounded-tl-none p-4 space-y-2">
                    <h3>Stats</h3>
                    <p>Cost</p>
                    <p>Magazine</p>
                    <p>Fire rate</p>
                    <p>Run speed</p>
                    <p>Reload Time</p>
                  </div>
                </div>
                <div className="w-full flex flex-col">
                  <div className="w-full bg-secondary rounded-primary rounded-tl-none p-4 space-y-2">
                    <h3>Damage</h3>
                    <p>0 - 15m</p>
                    <div className="flex">
                      <p>Head</p>
                      <p>Body</p>
                      <p>Legs</p>
                    </div>
                    <p>15 - 30m</p>
                    <div className="flex">
                      <p>Head</p>
                      <p>Body</p>
                      <p>Legs</p>
                    </div>
                    <p>30+</p>
                    <div className="flex">
                      <p>Head</p>
                      <p>Body</p>
                      <p>Legs</p>
                    </div>
                  </div>
                  <Extrusion
                    className="border-secondary ml-auto min-w-[35%] rounded-tl-primary"
                    cornerLocation={CornerLocation.BottomLeft}
                  />
                </div>
              </div>
            </div>
            <h2>{parseWeaponName(weapon)} Weapon Skins</h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="p-2 bg-secondary rounded-primary flex flex-col"
                >
                  <div className="w-full aspect-video bg-red-500/15 mb-2 rounded-primary"></div>
                  <h3>
                    {index + 1} {parseWeaponName(weapon)}
                  </h3>
                  <p className="text-input-foreground">Cost // 1000cr</p>
                </div>
              ))}
            </div>
          </Constrict>
        </div>
      </div>
    </div>
  );
}
