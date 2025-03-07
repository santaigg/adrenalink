import React from "react";
import Constrict from "@/app/components/layout/Constrict";
import TempBackgroundData from "@/app/assets/images/background/background-gun.png";
import BackgroundImage from "@/app/components/cosmetic/BackgroundImage";
import SpectrePointsIcon from "@/app/assets/images/brand/spectre-points.webp";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";
import Image from "next/image";
type Rarity = "Masterpiece" | "Prestige" | "Elite" | "none";

const RarityColor: Record<Rarity, string> = {
  Masterpiece: "text-[#EB3344]",
  Prestige: "text-[#F9B428]",
  Elite: "text-[#B75DFF]",
  none: "",
};

interface ShopItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan: number;
  itemName: string;
  rarity: Rarity;
  cost: number;
  discountedFrom?: number;
}

const ShopItem = React.forwardRef<HTMLDivElement, ShopItemProps>(
  ({ colSpan, itemName, rarity, cost, discountedFrom }, ref) => {
    const colSpanClasses: Record<number, string> = {
      1: "sm:col-span-1",
      2: "sm:col-span-2",
      3: "sm:col-span-3",
      4: "sm:col-span-4",
      5: "sm:col-span-5",
    };

    return (
      <div
        ref={ref}
        className={`rounded-t-primary overflow-hidden flex flex-col col-span-2 ${colSpanClasses[colSpan]}`}
      >
        <div className="w-full relative h-96">
          <BackgroundImage
            image={TempBackgroundData}
            className="!blur-0 saturate-100 brightness-100 mix-blend-normal"
          />
          <div className="absolute bg-black/45 top-8 right-0 h-7 flex items-center justify-start px-2">
            {discountedFrom && (
              <p className="line-through text-primary-foreground/75 mr-2">
                {discountedFrom}
              </p>
            )}
            <p className="text-lg mt-0.5">{cost}</p>
            <Image
              src={SpectrePointsIcon}
              alt="SP"
              className="ml-2 mr-4"
              width={36}
              height={36}
            />
          </div>
        </div>
        <div className="w-full shrink-0 bg-secondary rounded-br-primary h-14 flex items-center justify-start px-4">
          <h2 className={RarityColor[rarity]}>{itemName}</h2>
          {/* <p className="text-primary-foreground/50 ml-auto">{rarity}</p> */}
        </div>
        <Extrusion
          cornerLocation={CornerLocation.BottomRight}
          className="min-w-[min(13rem,50%)] border-secondary rounded-bl-primary"
        />
      </div>
    );
  }
);

const shopItemsData = [
  {
    colSpan: 5,
    itemName: "Bloodlust",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Killer Kawaii",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Omen",
    rarity: "Elite",
    cost: 1500,
    discountedFrom: 2000,
  },
  {
    colSpan: 5,
    itemName: "CyberLord",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Death Dealer Bundle",
    rarity: "Masterpiece",
    cost: 3000,
  },
  {
    colSpan: 5,
    itemName: "Symphony",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Winter Warrior",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Froyo",
    rarity: "Elite",
    cost: 1500,
    discountedFrom: 2000,
  },
  {
    colSpan: 5,
    itemName: "Quiet Killer",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 5,
    itemName: "Syndicate Bundle",
    rarity: "Elite",
    cost: 1500,
    discountedFrom: 2000,
  },
  {
    colSpan: 2,
    itemName: "Hellion Bundle",
    rarity: "Masterpiece",
    cost: 1200,
  },
  {
    colSpan: 1,
    itemName: "Outrider",
    rarity: "Masterpiece",
    cost: 900,
  },
  {
    colSpan: 1,
    itemName: "Honor In Battle",
    rarity: "Masterpiece",
    cost: 900,
  },
  {
    colSpan: 1,
    itemName: "Inclement Weather",
    rarity: "Prestige",
    cost: 500,
  },
  {
    colSpan: 2,
    itemName: "District Defender Bundle",
    rarity: "Masterpiece",
    cost: 900,
  },
  {
    colSpan: 1,
    itemName: "Mako Berserker RB3",
    rarity: "Elite",
    cost: 400,
  },
  {
    colSpan: 1,
    itemName: "Mako Harpe",
    rarity: "Elite",
    cost: 400,
  },
  {
    colSpan: 1,
    itemName: "Mako M2 Carbon",
    rarity: "Elite",
    cost: 400,
  },
  {
    colSpan: 2,
    itemName: "Starter Bundle",
    rarity: "none",
    cost: 500,
  },
  {
    colSpan: 1,
    itemName: "Beast",
    rarity: "Prestige",
    cost: 500,
  },
  {
    colSpan: 1,
    itemName: "Popstar",
    rarity: "Masterpiece",
    cost: 900,
  },
  {
    colSpan: 1,
    itemName: "Elegant Operative",
    rarity: "Prestige",
    cost: 900,
  },
];
export default async function ShopPage() {
  return (
    <div className="min-h-screen mb-16">
      <Constrict className="pt-8 px-2">
        <h1>Spectre Divide Shop</h1>
        <div className="w-full grid grid-cols-2 sm:grid-cols-5 mt-4 gap-4">
          {shopItemsData.map((item, index) => (
            <ShopItem
              key={index}
              colSpan={item.colSpan}
              itemName={item.itemName}
              rarity={item.rarity as Rarity}
              cost={item.cost}
              discountedFrom={item.discountedFrom}
            />
          ))}
        </div>
      </Constrict>
    </div>
  );
}
