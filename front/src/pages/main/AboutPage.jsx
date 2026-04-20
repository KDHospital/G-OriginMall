import BasicLayout from "../../layouts/BasicLayout";
import GimpoLogo from "../../assets/Gimpo_CI.png"
import { Link } from "react-router-dom";
const AboutPage = () => {
    return(
        <BasicLayout>
            <main className="pt-20">
                <section className="relative min-h-[700px] flex items-center overflow-hidden px-8">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 z-10">
                            <span className="inline-block px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-sm uppercase tracking-[0.2em] mb-6">김포의 땅에서 시작된 이야기</span>
                            <h1 className="text-2xl md:text-7xl leading-[1.1] text-primary mb-8">
                                 김포의 자연이 만든<br /><i className="italic font-black">진짜 특산물</i>
                            </h1>
                            <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-10">
                                G-Origin-Mall은 김포시에서 직접 재배된 특산물을 소비자에게 전달하는 로컬 기반 쇼핑몰입니다.
                                농부의 땀과 시간을 담은 농산물을 가장 신선한 상태로 만나볼 수 있도록,
                                유통 과정을 단순화하고 신뢰할 수 있는 품질을 제공합니다.
                            </p>
                            <div className="flex gap-6">
                                <Link to={"/products"} className="text-center flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95">김포 특산물 둘러보기</Link>
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative h-[600px]">
                            <div className="absolute inset-0 bg-surface-container-high rounded-3xl overflow-hidden editorial-shadow -rotate-2 transform translate-x-4">
                                <img alt="wide shot" className="w-full h-full object-cover opacity-90 mix-blend-multiply" data-alt="panoramic view of vast golden rice fields in Gimpo during autumn harvest with soft afternoon sun casting long shadows" src="https://i.postimg.cc/25YM6JSQ/Chat-GPT-Image-2026nyeon-4wol-16il-ohu-05-42-05.png" />
                            </div>
                            <div className="absolute -bottom-8 -left-8 w-64 h-80 bg-surface-container-lowest rounded-xl p-3 editorial-shadow rotate-3">
                                <img alt="close up" className="w-full h-full object-cover rounded-lg" data-alt="close-up of a single golden stalk of heavy Gimpo rice glistening with morning dew against a blurred warm background" src="https://i.postimg.cc/3x8bQGSP/Chat-GPT-Image-2026nyeon-4wol-16il-ohu-05-44-41.png" />
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- Section 2: Fertile Land (Bento Grid) --> */}
                <section className="bg-surface-container-low py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16 text-center max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl text-primary mb-6 font-black">서해와 한강이 만든 비옥한 땅<br /> 김포</h2>
                            <p className="text-on-surface-variant body-md">
                                김포는 서해의 해풍과 한강 유역의 비옥한 토양이 어우러진 지역으로,<br />
                                오랜 시간 농업이 발달해온 대한민국 대표 농산물 생산지입니다.<br />
                                이 특별한 환경이 김포 특산물의 깊은 맛과 품질을 만들어냅니다.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
                            <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest p-8 rounded-2xl editorial-shadow flex flex-col justify-end relative overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <img alt="river landscape" className="w-full h-full object-cover opacity-20" data-alt="misty morning view of the Han River valley winding through lush green agricultural plains in Gimpo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4UxYxdKwhhMXW_3KawAFyRZRt_iBPz7gzSoNifSr0Li0kmqEVTX0ezaYVUSXRd_DP7v4ZvVGYRZmEuAjXgieyMEzycqATTu3A3yCNcyAVo0QnGLASGQ9YCO_h_uRRFcwXVq4GTekk5Dij4BZnuS3D2B2JmTeOfO2PbF6g5y5Z9S1YnWC0ijFFoztI1GcX9nSJydCs_ZqiSRg7anfej-cKq-TbKF6zSv_y6Sj3hRB-Dq3afIKiYyCYJla0VjonGB-A8YgSXR_BQNqZ" />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-secondary font-bold text-3xl mb-2 block serif italic">01. 김포의 토양</span>
                                    <h3 className="text-2xl text-primary mb-4">수천 년 이어온 농업의 중심지</h3>
                                    <p className="text-on-surface-variant max-w-sm">
                                        김포는 오랜 시간 축적된 비옥한 토양과 풍부한 수자원을 바탕으로
                                        대한민국 대표 곡창지대 역할을 해왔습니다.                                        
                                    </p>
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-secondary-container p-8 rounded-2xl editorial-shadow flex flex-col justify-center">
                                <h3 className="text-3xl text-on-secondary-container mb-4 italic">햇빛과 바람이 만든 황금 들판</h3>
                                <p className="text-on-secondary-container opacity-80 leading-relaxed">
                                    김포의 들판은 계절마다 풍부한 일조량과 해풍의 영향을 받아
                                    농산물의 풍미를 더욱 깊게 만들어줍니다.                                    
                                </p>
                            </div>
                            <div className="bg-surface-container-high p-8 rounded-2xl editorial-shadow flex flex-col items-center text-center justify-center">
                                <span className="material-symbols-outlined text-primary text-5xl mb-4">water_drop</span>
                                <h4 className="text-primary font-bold">해풍이 만든 수분 환경</h4>
                            </div>
                            <div className="bg-primary-container p-8 rounded-2xl editorial-shadow flex flex-col items-center text-center justify-center">
                                <span className="material-symbols-outlined text-on-primary-container text-5xl mb-4">sunny</span>
                                <h4 className="text-on-primary-container font-bold">풍부한 일조량</h4>
                            </div>
                        </div>
                    </div>
                </section>            

                {/* <!-- Section 3: The Farmers (Storytelling Asymmetry) --> */}
                <section className="py-32 px-8 bg-surface">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative">
                            <img alt="heritage farmer" className="w-full aspect-[4/5] object-cover rounded-3xl editorial-shadow" data-alt="dignified portrait of an elderly Korean farmer with weathered hands and a warm smile, wearing traditional straw hat in a sunlit field" src="https://i.postimg.cc/1zLSJMmf/Chat-GPT-Image-2026nyeon-4wol-16il-ohu-05-34-32.png" />
                            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl editorial-shadow max-w-[240px]">
                                <p className="italic text-primary-container text-lg">“김포의 땅에서 기른,<br /> 그 가치를 그대로 <br /> 전하고 싶습니다.”</p>
                                <p className="text-sm font-label mt-4 text-secondary font-bold">김포금쌀 농부— 김ㅇㅇ</p>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-8">
                            <h2 className="text-5xl text-primary leading-tight font-black">한 알의 가치,<br />농부의 시간</h2>
                            <p className="text-on-surface-variant text-lg leading-relaxed">                                
                                G-Origin-Mall은 단순한 판매 플랫폼이 아닙니다.<br />
                                김포에서 오랜 시간 농사를 이어온 농가와 함께하며,<br />
                                그들의 정성과 경험이 담긴 농산물을 소비자에게 전달합니다.            
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-tertiary-fixed p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-on-tertiary-fixed">eco</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-primary">지속 가능한 생산</h4>
                                        <p className="text-on-surface-variant">자연을 해치지 않는 방식으로 재배된 농산물만을 선별하여 제공합니다.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-tertiary-fixed p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-on-tertiary-fixed">diversity_3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-primary">지역 상생 플랫폼</h4>
                                        <p className="text-on-surface-variant">
                                            지역 농가와 소비자를 직접 연결하여
                                            안정적인 판로와 합리적인 소비 환경을 동시에 제공합니다.                                            
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>       


                {/* <!-- Section 4: Geumbitnaru Quality (Glassmorphism & Texture) --> */}
                <section className="relative py-24 px-8 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
                        <img alt="texture background" className="w-full h-full object-cover" data-alt="abstract macro texture of polished golden grains of rice in a minimalist, high-end editorial composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqaTRsvWJ4N5Q-szmuGT4LatN-7ZwGmxC7gLiNFboA-C49VDMXcdulth50luAvzyLq6HqFjoSeaf-z9NegC0QV404ReB4VaRaeBMrSDUs2ASS4VvETkaIDiHygqNQdbZ5ux2kd6Ij3bIpznLY3xbP9UF7isdusWniaW_DPmvgUgA8x5AlVTWFElxri8ZqQCzU7_90pTcrlgJt4BbDobtm3Fwl217D7pu_1sJlNdNBtaKLyYUq7fFrKsy5xNKDXZejuFqITbdPzM8cL" />
                    </div>
                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <div className="mb-12 inline-block">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-secondary to-secondary-container rounded-full flex items-center justify-center p-1">
                                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center border-2 border-secondary-fixed">
                                    <img src={GimpoLogo} alt="금빛나루 로고" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-6xl text-on-primary mb-8 serif font-black">금빛나루 인증</h2>
                        <p className="text-on-primary-container text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
                            금빛나루 인증은 김포시에서 생산된 특산물 중<br />
                            품질, 원산지, 생산 과정 등을 종합적으로 검증하여 부여되는 기준입니다.<br />
                            G-Origin-Mall은 이 인증을 통해 신뢰할 수 있는 상품만을 제공합니다.                            
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                                <h5 className="text-secondary-fixed text-3xl font-serif mb-2">100%</h5>
                                <p className="text-on-primary font-label text-sm tracking-widest uppercase">김포시 생산</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                                <h5 className="text-secondary-fixed text-3xl font-serif mb-2">0%</h5>
                                <p className="text-on-primary font-label text-sm tracking-widest uppercase">엄격한 품질 검증</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                                <h5 className="text-secondary-fixed text-3xl font-serif mb-2">AAA</h5>
                                <p className="text-on-primary font-label text-sm tracking-widest uppercase">신뢰 가능한 특산물</p>
                            </div>
                        </div>
                    </div>
                </section>              
                {/* <!-- Signature Component: Provenance Tag --> */}
                <section className="py-24 text-center">
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto px-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-label font-bold tracking-tight">
                            <span className="material-symbols-outlined text-sm">location_on</span> 김포 생산
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-label font-bold tracking-tight">
                            <span className="material-symbols-outlined text-sm">potted_plant</span> 직접 재배
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-label font-bold tracking-tight">
                            <span className="material-symbols-outlined text-sm">verified_user</span> 금빛나루 인증
                        </span>
                    </div>
                </section>                               
            </main>
        </BasicLayout>
    )
}
export default AboutPage