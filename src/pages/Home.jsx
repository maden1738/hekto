import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import Featured from "../components/Featured";
import { Link } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";
import noImage from "../assets/noimage.jpg";
import ProductLoader from "../components/common/ProductLoader";
import { useDispatch, useSelector } from "react-redux";
import { setCart, addToCart } from "../app/slice/cartSlice";
import { toast } from "react-toastify";
import useAuthenticate from "../hooks/useAuthenticate";

export default function Home() {
  const [latestProduct, setLatestProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const authenticate = useAuthenticate();
  const user = useSelector((store) => store.user.value);

  useEffect(() => {
    axios
      .get("https://ecommerce-sagartmg2.vercel.app/api/products/?per_page=6")
      .then((res) => {
        setLatestProduct(res.data.products);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Carousel />
      <Featured />

      <div className=" mb-[100px] mt-[100px] font-body">
        <h2 className="mb-6 text-center text-4xl font-bold text-violet-950">
          Latest Product
        </h2>
        <ul className="wrapper grid gap-[31px] md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            [1, 2, 3, 4, 5, 6].map((el) => {
              return <ProductLoader />;
            })}
          {latestProduct.map((el) => {
            return (
              <li className="group  hover:shadow-2xl">
                <Link to={`/products/${el._id}`}>
                  <div className="relative bg-slate-50 group-hover:bg-white">
                    <span className="absolute bottom-4 left-0  flex  scale-0 flex-col gap-4 p-4 group-hover:scale-100">
                      <IoCartOutline
                        className="cursor-pointer text-lg text-primary"
                        onClick={(event) => {
                          event.preventDefault();
                          if (user) {
                            authenticate(() => {
                              dispatch(addToCart(el));
                              alert("added to cart");
                            });
                          } else {
                            toast.error("Login Required");
                          }
                        }}
                      />
                      <FaRegHeart
                        className="cursor-pointer text-primary"
                        onClick={() => {
                          alert("added to favorites");
                        }}
                      />
                    </span>
                    <div className="flex items-center justify-center">
                      <img
                        src={el.image ? el.image : noImage}
                        alt=""
                        className="h-[220px] w-[220px] object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-secondary">
                    <p>{el.name}</p>
                    <p className="mr-2">${el.price}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
