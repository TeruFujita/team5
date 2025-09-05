import Image from "next/image";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="site-title">ロゴと名前考えましょ</div>
        <nav className="site-nav">
          <a>動画視聴</a>
          <a>動画投稿</a>
          <a>ログイン</a>
          <a className="signup">サインアップ</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-oval">
          <h1 className="hero-title">サービスの名前を考えましょう</h1>
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
            <h2 className="headline-under">○○とは？</h2>
            <p>
              後継者不足で失われていく技術・文化を守るための
              動画視聴・配信のプラットフォームです。
            </p>
          </div>
        </div>
      </section>

      <section className="search">
        <div className="search-container">
          <h3 className="trending-text">急上昇動画</h3>
          <div className="search-box">
            <input type="text" placeholder="探す" />
            <button aria-label="search">🔍</button>
          </div>
        </div>
      </section>

      <section className="carousel">
        <div className="cards">
          {Array.from({ length: 5 }).map((_, i) => (
            <article key={i} className={`card ${i === 2 ? "active" : ""}`}>
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
                <p>はじめしゃちょー</p>
              </div>
            </article>
          ))}
        </div>
        <div className="dots">
          {[0, 1, 2, 3, 4].map((d) => (
            <span key={d} className={`dot ${d === 2 ? "current" : ""}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
