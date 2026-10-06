"use client";
import { getLandingProducts } from "@/lib/data";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "./elements/navigation";

const generateStyles = (
  container: HTMLDivElement | null,
  count: number
): React.CSSProperties[] => {
  const styles: React.CSSProperties[] = [];
  // if (count === 2) {
  //   return [{}, {}];
  // }
  const cardWidth = container?.clientWidth ?? 450;
  const width = container?.parentElement?.clientWidth ?? 1440;
  console.log("width", width);
  console.log("cardWidth", cardWidth);
  console.log("count", Math.floor(count / 2));
  console.log("%", (width - cardWidth) / 2 / Math.floor(count / 2));

  let zIndex = 1;
  let l = -Math.floor(count / 2);

  for (let i = 0; i < count; i++) {
    styles.push({
      zIndex: zIndex,
      transform: `translate3d(calc(${
        ((width - cardWidth) / 2 / Math.floor((count - 1) / 2)) * l
      }px - ${cardWidth * i}px), 0, ${-Math.abs(100 * l++)}px)`,
      width: `${cardWidth}px`,
      // minWidth: `450px`,
      // minWidth: `${cardWidth}px`,
      // width: `${cardWidth}px`,
      // left: `${left}px`,
      // zIndex: Math.abs(zIndex++),
      // scale: `${100 - Math.abs(blur) * 15}%`,
      background: `${
        i + 1 === Math.ceil(count / 2)
          ? "linear-gradient(45deg, #fff, #eff9fd)"
          : "linear-gradient(45deg, #fff, #e3f6ff)"
      }`,
      filter: `blur(${Math.floor(count / 2) - Math.abs(zIndex++)}px)`,
    });

    if (zIndex == Math.ceil(count / 2)) {
      zIndex = -zIndex;
    }
  }
  return styles;
};

export default function Products(): React.ReactElement {
  const locale = useParams().locale as "uz" | "ru";
  const container = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ProductType[]>([]);
  const [styles, setStyles] = useState<React.CSSProperties[]>([]);
  console.log(styles);

  useEffect(() => {
    setStyles(generateStyles(container.current, data.length));
    const handleResize = () => {
      setStyles(generateStyles(container.current, data.length));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data.length]);

  useEffect(() => {
    function fetchPosts() {
      const data = getLandingProducts() as unknown as ProductType[];
      setData(data);
    }
    fetchPosts();
  }, []);

  const onChangeHandler = (orientation: "left" | "right") => {
    // if (orientation === "left") {
    //   const newStyles = styles.slice(1, styles.length).concat(styles[0]);
    //   setStyles(newStyles);
    // } else {
    //   const newStyles = styles
    //     .slice(styles.length - 1, styles.length)
    //     .concat(styles.slice(0, styles.length - 1));
    //   setStyles(newStyles);
    // }
    console.log(container.current?.clientWidth);
  };

  return (
    <div
      className="mt-8 py-8 container overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div
        className="xl:w-[450px] md:w-[400px] max-md:w-[70%] mx-auto flex"
        ref={container}
        style={{ transformStyle: "preserve-3d" }}
      >
        {data.map((product, index) => (
          <Product
            key={index}
            {...product}
            name={product[`name_${locale}`]}
            style={styles.at(index) ?? {}}
            onChangeHandler={() =>
              onChangeHandler(
                parseInt(
                  styles.at(index)?.left?.toString().split("px")[0] ?? "0"
                ) <
                  (container.current?.parentElement?.clientWidth ?? 1440) / 2 -
                    (container.current?.clientWidth ?? 450) / 2
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
        "flex shrink-0 max-sm:h-50 gap-7 p-4 rounded-3xl bg-white border shadow-xl cursor-pointer select-none top-0 transition-transform duration-500"
      )}
    >
      <Image
        src={image}
        alt={name}
        width={140}
        height={200}
        className="max-sm:h-32 w-40 h-52 rounded-2xl border object-cover"
      />
      <div className="flex flex-col justify-around">
        <div>
          <span className="uppercase text-base text-[#989898]">
            {t("name")}
          </span>
          <h1 className="text-xl font-bold">{name}</h1>
        </div>
        <div>
          <span className="uppercase text-base text-[#989898]">
            {t("price")}
          </span>
          <p className="text-3xl font-bold">{price} {t(price_type)}</p>
        </div>
        <Link
          href={{
            pathname: "/products/[id]",
            params: { id },
          }}
          className="text-blue-500"
        >
          {t("more")}
        </Link>
      </div>
    </div>
  );
}
