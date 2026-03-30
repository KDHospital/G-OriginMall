const DetailedDescription = () => {
    return(
        <div className="py-16 space-y-24">
            {/* Detailed Description Section */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl">
                    <img alt="Rice Field" className="w-full object-cover" data-alt="cinematic wide shot of lush green rice terraces in Gimpo at sunrise with soft mist clinging to the valley floors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA1q7FRSJ31TV5MsplWhZReymIfv0LJxLzNv3yvyKiedlQSbKynE-GJt4H51yTvUJQN4gOGBd0klg4DAtUmB9a6nqmiMt2IE2YEBaVaV3MygQ_mIw439mDcEZYIwNQW-xyw85KyKG89DQy7c_L8wSQN5hu2qmK889gCl95tZIPmwd1ghZuKgaGY-wx8wFiDPS5ySzuHgqDrYksicXNLq3_Soi1WvCmqbaYz2De7ZWcmBRcOKnyz7V4rOAafIoItPrshSrUExNP7SA" />
                </div>
                <div className="lg:col-span-5 lg:-ml-24 lg:mt-24 bg-surface-container-lowest p-12 rounded-2xl shadow-xl z-10 border border-outline-variant/10">
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 inline-block">G-Origin Exclusive</span>
                    <h2 className="font-headline text-4xl font-bold text-primary mb-6">Born from Ancient River Soil</h2>
                    <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
                        Gimpo's unique topography, nestled between the Han River and the Yellow Sea, creates a mineral-rich alluvial soil found nowhere else in the world. This specific earth composition infuses each grain of Gimpo Gold Rice with superior elasticity and a natural sweetness that peaks during the autumn harvest.
                    </p>
                    <div className="flex items-center gap-4 text-primary font-bold">
                        <span className="material-symbols-outlined">workspace_premium</span>
                        <span>GAP National Quality Certification</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <img alt="Rice Grain Detail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="top-down macro photography of uncooked rice grains arranged in a perfect geometric pattern on a dark slate background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtceHeU_ZNG8nwfOT1YV80DtI3ITjqTMuIDANqfNSy-uEmizKwbvQ1Z45S8tQBuAo6Mk1MfXbPwWrlTyVwqbPykG7lltRs31aqmPjydgWI3vP-jj7f9b8Y0LCFzMNgdysBh8E6pKSqMtRMLQxwh7c0bw9mUhE3-Zr3ul20PRErAPBMxJJDTT_abp5VyBN618ZmvyfqxvsdDWIdpASVDZo6dTiay766lM3pBALAGK_NJnEeQ-9lfpXNKvhn0GNlmPfM0JVwXDbYKA4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                        <h3 className="text-white text-2xl font-bold">Unparalleled Texture</h3>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <img alt="Cooked Rice Close-up" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="extreme close up of a spoonful of glistening white rice with soft steam rising against a dark moody background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD0hKmRszEQdL1gGBbufuE75p-a-NekbrEqZWc-IJStmuR_ZFYarY93C3p_OlJMrARn2B6Kwjztm4OLCrSKE5KBxtaIL8vyqP-adBuoWPCF83_go3Yhl8HcSQumOAzpIRV4buFkxKHDtkR_BZiTiuSTHUUxEUxrjTAN3PoCK75RXlc0HbhZlF1syfoFf0oF7toLP36lNgwu2QmYGchjW35w6S94w_P_qLeB_YgcyryKmDw9SdxLoXSf1WqqROzghKawTPI4x3v7GQ" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent flex items-end p-8">
                        <h3 className="text-white text-2xl font-bold">Aromatic Excellence</h3>
                    </div>
                </div>
            </div>
            <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="font-headline text-3xl font-bold text-primary">The Gimpo Standard</h3>
                <p className="text-on-surface-variant italic">"We don't just sell rice; we preserve the heritage of Korean agriculture. Every bag is traced from seed to table, ensuring that the legacy of Gimpo's golden fields reaches your home in its purest form."</p>
            </div>
        </div>        
    )
}
export default DetailedDescription