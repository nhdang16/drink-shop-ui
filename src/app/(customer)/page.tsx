"use client";
import Advertise from "@/components/homepage/Advertise";
import MenuList from "./menu/components/MenuList";
import { useEffect, useState, Suspense } from "react";
import { drinkshopService } from "@/utils/services/drinkshopService";
import Menu from "@/components/Menu";
import { useRouter } from "next/navigation";

interface ProductDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  ingredients: string;
  category: string;
}

export default function Home() {
  const router = useRouter();
  const [topProducts, setTopProducts] = useState<ProductDTO[]>([]);
  useEffect(() => {
    const fetchTopSold = async () => {
      try {
        const res = await drinkshopService.api.getTopSoldProducts();
        setTopProducts(res.data as ProductDTO[]);
      } catch (e) {
        console.error("Error fetching top sold products:", e);
      }
    };
    fetchTopSold();
  }, []);
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visitedHome");
    if (hasVisited) {
      return;
    }
    sessionStorage.setItem("visitedHome", "true");

    const recordVisit = async () => {
      try {
        await drinkshopService.api.recordVisit();
      } catch (err) {
        console.error("Failed to record visit:", err);
      }
    };
    recordVisit();
  }, []);

  return (
    <div>
      <main className="pb-28">
        {/* background image */}
        <div
          style={{ backgroundImage: "url('/images/About.jpg')" }}
          className="h-[500px] bg-cover bg-center"
        >
          <div className="flex flex-col pt-16 pl-16 font-poppins h-full justify-between">
            <div className="text-primary flex flex-col text-center">
              <h1 className="font-semibold text-[60px] font-playfair">
                Hem Tra Chanh
              </h1>
            </div>
            <div
              onClick={() => router.push("/menu")}
              className="bg-white py-3 w-[125px] rounded-3xl text-center mb-12 cursor-pointer"
            >
              <span className="font-semibold text-[15px]">Order Now</span>
            </div>
          </div>
        </div>
        {/* background image */}

        <div className="pt-6 flex flex-col items-center">
          <span className="font-poppins text-[60px] font-light">
            Top Products
          </span>
          <div className="flex gap-16 pt-4 pb-11">
            {topProducts.map((item) => (
              <Menu
                key={item.id}
                id={item.id}
                imagePath={item.image}
                name={item.name}
                des={item.description}
                price={item.price}
                category={item.category}
              />
            ))}
          </div>
          <div
            onClick={() => router.push("/menu")}
            className="py-3 px-10 rounded-3xl cursor-pointer"
          >
            <span className="font-poppins font-semibold text-lg text-primary">
              View All
            </span>
          </div>
        </div>

        {/* advertise */}
        <div className="pl-[90px] py-14 pr-[120px]">
          <Advertise />
        </div>
        {/* advertise */}

        {/* our menu */}
        <div className="flex flex-col items-center">
          <span className="font-poppins font-light text-[60px]">
            Our Menu
          </span>
          <div className="pt-5 flex gap-6">
            <Suspense fallback={<div>Loading menu...</div>}>
              <MenuList />
            </Suspense>
          </div>
        </div>
        {/* our menu */}
      </main>
    </div>
  );
}
