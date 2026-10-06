"use client";
import { getLandingProducts } from "@/lib/data";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "./elements/navigation";

const generateStyles = (width: number, cardWidth: number, count: number): React.CSSProperties[] => {
  const styles: React.CSSProperties[] = [];
  if (count === 2) {
    return [{}, {}];
  }
  let zIndex = 1;
  let blur = -Math.floor(count / 2);
  let left = -cardWidth * Math.abs(blur) * 0.075;
  const center = width / 2;
  for (let i = 0; i < count; i++) {
    styles.push({
      minWidth: `${cardWidth}px`,
      width: `${cardWidth}px`,
      left: `${left}px`,
      zIndex: Math.abs(zIndex++),
      scale: `${100 - Math.abs(blur) * 15}%`,
      background: `${i + 1 === Math.ceil(count / 2) ? "white" : "linear-gradient(45deg, #fff, #e3f6ff)"}`,
      filter: `blur(${Math.abs(blur++)}px)`,
    });
    left += (center - cardWidth / 2) / (Math.ceil(count / 2) - 1) + cardWidth * 0.075;

    if (zIndex == Math.ceil(count / 2)) {
      zIndex = -zIndex;
    }
  }
  return styles;
};

export default function Products(): React.ReactElement {
  const locale = useParams().locale as "uz" | "ru";
  const t = useTranslations("landing.products");

  const container = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(container.current?.clientWidth ?? 1440);
  const [cardWidth, setCardWidth] = useState(450);

  const [data, setData] = useState<ProductType[]>([]);
  const [styles, setStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setStyles(generateStyles(containerWidth, cardWidth, data.length));
  }, [cardWidth, containerWidth, data.length]);

  useEffect(() => {
    // Fetch products
    function fetchPosts() {
      const data = getLandingProducts() as unknown as ProductType[];
      if (data.length > 0 && data.length % 2 == 0) {
        setData(data.concat(data[0]));
      } else {
        setData(data);
      }
    }
    fetchPosts();
    setContainerWidth(container.current?.clientWidth ?? 1440);
    // Resize event listener
    const handleResize = () => {
      setContainerWidth(container.current?.clientWidth ?? 1440);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    switch (true) {
      case containerWidth < 400:
        setCardWidth(containerWidth - 50);
        break;
      case containerWidth < 550:
        setCardWidth(containerWidth - 100);
        break;
      case containerWidth < 900:
        setCardWidth(350);
        break;
      case containerWidth < 1350:
        setCardWidth(400);
        break;
      default:
        setCardWidth(450);
    }
  }, [containerWidth]);

  const onChangeHandler = (orientation: "left" | "right") => {
    if (orientation === "left") {
      const newStyles = styles.slice(1, styles.length).concat(styles[0]);
      setStyles(newStyles);
    } else {
      const newStyles = styles.slice(styles.length - 1, styles.length).concat(styles.slice(0, styles.length - 1));
      setStyles(newStyles);
    }
  };
  return (
    <div className="container mt-20 max-sm:mt-4 xl:px-14 md:px-8 max-sm:px-4">
      <h2 className="xl:text-5xl md:text-4xl sm:text-3xl max-sm:text-2xl font-bold text-center mt-5">{t("title")}</h2>
      <div className="container mt-16 h-52 relative" ref={container}>
        {data.map((product, index) => (
          <Product
            key={index}
            {...product}
            name={product[`name_${locale}`]}
            style={styles.at(index) ?? {}}
            onChangeHandler={() =>
              onChangeHandler(
                parseInt(styles.at(index)?.left?.toString().split("px")[0] ?? "0") < containerWidth / 2 - cardWidth / 2
                  ? "left"
                  : "right"
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

type ProductType = {
  style: React.CSSProperties;
  id: number;
  name: string;
  name_ru: string;
  name_uz: string;
  price: string;
  price_type: string;
  image: string;
  onChangeHandler: () => void;
};

function Product(props: ProductType): React.ReactElement {
  const t = useTranslations("landing.products");
  const { style, id, name, price, price_type, image, onChangeHandler } = props;
  return (
    <div
      style={style}
      onClick={() => onChangeHandler()}
      className={cn(
        "flex max-sm:h-50 gap-7 max-sm:gap-3 p-4 max-sm:p-3 rounded-3xl bg-white border shadow-xl cursor-pointer absolute select-none top-0 transition-[left,scale] duration-500"
      )}>
      <Image
        src={image}
        alt={name}
        width={140}
        height={200}
        className="w-40 h-52 max-sm:h-32 max-sm:w-2/5 rounded-2xl border object-cover"
      />
      <div className="flex flex-col justify-around">
        <div>
          <span className="uppercase text-base max-sm:text-sm text-[#989898]">{t("name")}</span>
          <h1 className="text-xl max-sm:text-lg max-xs:text-base font-bold line-clamp-2">{name}</h1>
        </div>
        <div>
          <span className="uppercase text-base max-sm:text-sm text-[#989898]">{t("price")}</span>
          <p className="text-3xl max-sm:text-xl font-bold">
            {price} {t(price_type)}
          </p>
        </div>
        <Link
          href={{
            pathname: "/products/[id]",
            params: { id },
          }}
          className="text-blue-500">
          {t("more")}
        </Link>
      </div>
    </div>
  );
}
