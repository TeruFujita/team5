"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(2); // 真ん中のカード（インデックス2）を初期表示
  const totalSlides = 5;
  const cardsRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // スクロール位置を制御
  useEffect(() => {
    if (cardsRef.current) {
      const cardWidth = cardsRef.current.scrollWidth / totalSlides;
      const scrollPosition = currentSlide * cardWidth;
      cardsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, totalSlides]);
  return (
    <main>
      <header className="site-header">
        <Image 
          src="/結継.png" 
          alt="結継" 
          width={200} 
          height={60} 
          className="site-title-image"
        />
        <nav className="flex items-center space-x-8">
          <a href="/videos" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
            動画視聴
          </a>
          <a href="/upload" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
            動画投稿
          </a>
          {user ? (
            <>
              <span className="text-gray-700 font-medium py-2">
                こんにちは、{user.user_metadata?.name || user.email}さん
              </span>
              <button 
                onClick={signOut}
                className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-700 hover:text-[#b40808] font-medium py-2">
                ログイン
              </a>
              <a href="/signup" className="bg-[#b40808] text-white px-4 py-2 rounded-lg hover:bg-[#a00808] transition-colors font-medium">
                サインアップ
              </a>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-oval">
          <Image 
            src="/結継.png" 
            alt="結継" 
            width={200} 
            height={80} 
            className="hero-title-image"
          />
          <div className="hero-icons" aria-hidden>
            <div className="icons-row">
              <Image src="/774845fe643ab4ea7cdc8c83575873598c78732e.png" alt="icon1" width={120} height={120} />
              <Image src="/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png" alt="icon2" width={120} height={120} />
              <Image src="/43a54de8e7466d2cf9bd2d6d54c1b651b275377b.png" alt="icon3" width={120} height={120} />
              <Image src="/b64f7bef3ba41c1ee82d593059a243aec6f58fd6.png" alt="icon4" width={120} height={120} />
            </div>
            <div className="icons-row">
              <Image src="/b3f8ad43ec466ecd514a53912e3ae458517e4065.png" alt="icon5" width={120} height={120} />
              <Image src="/1290e1d2fbc59b74e513fa207e51e52b7064a3cb.png" alt="icon6" width={120} height={120} />
              <Image src="/12b6e0c86c31b9e158aa93e3c2c402fc371162f1 (1).png" alt="icon7" width={120} height={120} />
              <Image src="/099d87b0cdd4ddcb36d0a5850c5bf38746e73329.png" alt="icon8" width={120} height={120} />
            </div>
          </div>
          <div className="hero-desc">
            <h2 className="headline-under">結継とは？</h2>
            <p>
              後継者不足で失われていく技術・文化を守るための
              動画視聴・配信のプラットフォームです。
            </p>
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-box">
            伝統工芸の分野では、<br />
            60歳以上の職人が<br />
            全体の70%以上を<br />
            占めている
          </div>
          <div className="stat-box">
            伝統工芸の道を目指す<br />
            20代から30代の<br />
            職人は全体の10%未満
          </div>
          <div className="stat-box">
            伝統工芸の道を目指す<br />
            かかわる事業所数は、<br />
            過去20年間で約40%減少
          </div>
        </div>
      </section>

      <section className="search">
        <div className="search-layout">
          <h3 className="trending-text">急上昇動画</h3>
          <div className="search-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </section>

      <section className="carousel">
        <div className="cards" ref={cardsRef}>
          {Array.from({ length: 5 }).map((_, i) => (
            <article key={i} className={`card ${i === currentSlide ? "active" : ""}`}>
              <div className="thumb">
                <Image
                  src="/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png"
                  alt="thumb"
                  width={320}
                  height={200}
                />
              </div>
              <div className="meta">
                <h3>はじめしゃちょー結婚しました。</h3>
                <div className="channel-info">
                  <div className="channel-icon">
                    <Image
                      src="/40e6ebd4dddbca6e172ca97aeb877556f2fd4c47.png"
                      alt="channel"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p>はじめしゃちょー</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="carousel-controls">
          <button className="arrow-btn left-arrow" onClick={prevSlide}>‹</button>
          <div className="dots">
            {[0, 1, 2, 3, 4].map((d) => (
              <span 
                key={d} 
                className={`dot ${d === currentSlide ? "current" : ""}`}
                onClick={() => goToSlide(d)}
              />
            ))}
          </div>
          <button className="arrow-btn right-arrow" onClick={nextSlide}>›</button>
        </div>
      </section>
    </main>
  );
}
