import Image from "next/image";
import JourneyMediaMotion from "./JourneyMediaMotion";

const journeyImages = [
    {
        src: "/artist/journey/epifania_process_01.jpg",
        alt: "Early painting stage of Epifanía",
        height: "h-[19rem] md:h-[25rem] lg:h-[30rem]",
    },
    {
        src: "/artist/journey/misionero_process_01.jpg",
        alt: "Early painting stage of El Misionero",
        height: "h-[22rem] md:h-[29rem] lg:h-[34rem]",
    },
    {
        src: "/artist/journey/rose_process_01.jpg",
        alt: "Early painting stage of Rose",
        height: "h-[18rem] md:h-[23rem] lg:h-[27rem]",
    },

    {
        src: "/artist/journey/epifania_process_02.jpg",
        alt: "Developing stage of Epifanía",
        height: "h-[24rem] md:h-[31rem] lg:h-[37rem]",
    },
    {
        src: "/artist/journey/misionero_process_02.jpg",
        alt: "Developing stage of El Misionero",
        height: "h-[19rem] md:h-[25rem] lg:h-[30rem]",
    },
    {
        src: "/artist/journey/rose_process_02.jpg",
        alt: "Developing stage of Rose",
        height: "h-[21rem] md:h-[28rem] lg:h-[33rem]",
    },

    {
        src: "/artist/journey/epifania_process_03.jpg",
        alt: "Painting process of Epifanía",
        height: "h-[20rem] md:h-[27rem] lg:h-[32rem]",
    },
    {
        src: "/artist/journey/misionero_process_03.jpg",
        alt: "Painting process of El Misionero",
        height: "h-[24rem] md:h-[32rem] lg:h-[38rem]",
    },
    {
        src: "/artist/journey/rose_process_03.jpg",
        alt: "Painting process of Rose",
        height: "h-[19rem] md:h-[24rem] lg:h-[29rem]",
    },

    {
        src: "/artist/journey/epifania_process_04.jpg",
        alt: "Advanced painting stage of Epifanía",
        height: "h-[23rem] md:h-[30rem] lg:h-[36rem]",
    },
    {
        src: "/artist/journey/misionero_process_04.jpg",
        alt: "Advanced painting stage of El Misionero",
        height: "h-[20rem] md:h-[27rem] lg:h-[32rem]",
    },
    {
        src: "/artist/journey/rose_process_04.jpg",
        alt: "Advanced painting stage of Rose",
        height: "h-[22rem] md:h-[29rem] lg:h-[35rem]",
    },

    {
        src: "/artist/journey/epifania_process_05.jpg",
        alt: "Later painting stage of Epifanía",
        height: "h-[19rem] md:h-[25rem] lg:h-[30rem]",
    },
    {
        src: "/artist/journey/misionero_process_05.jpg",
        alt: "Later painting stage of El Misionero",
        height: "h-[24rem] md:h-[32rem] lg:h-[38rem]",
    },
    {
        src: "/artist/journey/rose_process_05.jpg",
        alt: "Later painting stage of Rose",
        height: "h-[20rem] md:h-[27rem] lg:h-[32rem]",
    },

    {
        src: "/artist/journey/epifania_process_06.jpg",
        alt: "Advanced painting process of Epifanía",
        height: "h-[23rem] md:h-[30rem] lg:h-[36rem]",
    },
    {
        src: "/artist/journey/rose_process_06.jpg",
        alt: "Advanced painting process of Rose",
        height: "h-[21rem] md:h-[28rem] lg:h-[34rem]",
    },
];

export default function JourneyMedia() {
    return (
        <div
            data-journey-media
            className="
                relative
                mt-28
                w-full
                overflow-hidden

                md:mt-36
                lg:mt-44
            "
        >
            {/* =============================================
                EDGE FADES
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    z-20
                    w-[12vw]

                    bg-gradient-to-r
                    from-neutral-950
                    to-transparent
                "
                aria-hidden="true"
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    z-20
                    w-[12vw]

                    bg-gradient-to-l
                    from-neutral-950
                    to-transparent
                "
                aria-hidden="true"
            />

            {/* =============================================
                CINEMATIC STRIP
            ============================================== */}

            <div
                data-journey-media-track
                className="
                    flex
                    w-max
                    items-center
                    gap-6
                    px-[8vw]

                    md:gap-8
                    lg:gap-10
                "
            >
                {journeyImages.map((image, index) => (
                    <figure
                        key={image.src}
                        data-journey-media-item
                        className={`
                            relative
                            shrink-0
                            overflow-hidden

                            ${image.height}
                        `}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={1200}
                            height={1600}
                            sizes="
                                (max-width: 768px) 70vw,
                                (max-width: 1200px) 45vw,
                                32vw
                            "
                            className="
                                h-full
                                w-auto
                                max-w-none
                                object-contain
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-neutral-950/15
                                via-transparent
                                to-transparent
                            "
                            aria-hidden="true"
                        />

                        <span
                            className="
                                absolute
                                bottom-3
                                left-3

                                font-sans
                                text-[0.52rem]
                                uppercase
                                tracking-[0.24em]
                                text-[#F5EFE6]/30
                            "
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </figure>
                ))}
            </div>

            <JourneyMediaMotion />
        </div>
    );
}