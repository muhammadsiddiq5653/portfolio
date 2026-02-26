import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projectVariant } from "../../../variants/projectVariant";
import Github from "../../Utils/icons/Github";
import LiveLink from "./icon/LiveLink";
import PlayStore from "./icon/PlayStore";
import AppStore from "./icon/AppStore";

export type ProjectCardprops = {
  image: string;
  name: string;
  about: string;
  link: string;
  playStoreLink: string;
  appStoreLink: string;
  builtWith: string[];
  contribution: string[];
  orientation: number;
};

const ProjectsCard = ({
  about,
  image,
  link,
  name,
  playStoreLink = '',
  appStoreLink = '',
  builtWith,
  contribution,
  orientation,
}: ProjectCardprops) => {
  return (
    <m.div
      className="w-full rounded-lg shadow-2xl lg:shadow-none"
      initial={{ opacity: 0, y: 25 }}
      variants={projectVariant}
      whileInView={projectVariant.image}
      viewport={{ once: true }}
    >
      <div className="max-w-5xl relative h-[33rem] sm:h-[30rem] lg:h-[22rem] xl:h-[28rem] flex flex-col overflow-hidden ">
        <div
          className={`absolute inset-0 w-[20rem] h-[33rem] sm:h-[30rem] lg:top-1/2 lg:-translate-y-1/2 flex lg:items-start flex-col`}
        >
          <Link
            href={`${link}`}
            className={`min-w-[20rem] w-[37rem] md:w-[50rem] lg:w-[42rem] h-[33rem] sm:h-[30rem] lg:h-[22rem] xl:h-[28rem] absolute  rounded-xl duration-300 cursor-pointer opacity-10 lg:opacity-25 hover:opacity-50 ${
              orientation === 1 ? "lg:left-0" : "lg:left-full"
            }`}
            target="_blank"
          >
            <Image src={`/${image}`} alt={`${name} image`} fill priority />
          </Link>
        </div>
        {/* text */}
        <div
          className={`${
            orientation === 1
              ? "absolute top-1/2 right-0 -translate-y-1/2 max-w-[44rem] px-6 py-8 lg:p-0 flex lg:items-end flex-col w-full"
              : "absolute top-1/2 left-0 -translate-y-1/2 max-w-[44rem] px-6 py-8 lg:p-0 flex lg:items-start flex-col w-full"
          }`}
        >
          <Link
            href={`${link}`}
            className="mb-4 text-xl font-bold tracking-wider text-white capitalize cursor-pointer select-none lg:text-2xl"
            target="_blank"
          >
            {name}
          </Link>
          <div className="py-5 mb-4 text-base font-normal text-white duration-300 rounded-lg shadow-xl md:bg-gray/90 lg:text-lg md:p-6 lg:px-7 lg:py-7 hover:shadow-2xl hover:-translate-y-1">
            {about}
          </div>

          <div className="py-5 mb-4 text-sm text-white duration-300 rounded-lg shadow-xl md:bg-gray/90 lg:text-base md:p-6 lg:px-7 lg:py-7 hover:shadow-2xl hover:-translate-y-1">
            {contribution.map((item, index) => (
              <p key={index} className="text-sm">
                {item}
              </p>
            ))}
            {/* <p className="text-sm">{contribution}</p> */}
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-4 md:justify-start">
            {builtWith.map((item, index) => (
              <span
                key={index}
                className="text-sm font-semibold capitalize rounded-md select-none text-cyan lg:text-base"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center pt-5 pb-2 mt-5 space-x-4">
            {link && (
              <Link
                href={link}
                target="_blank"
                aria-label={`${name} website link`}
              >
                <LiveLink />
              </Link>
            )}

            {playStoreLink && (
              <Link
                href={playStoreLink}
                target="_blank"
                aria-label={`${name} play store link`}
              >
                <PlayStore />
              </Link>
            )}
            {appStoreLink && (
              <Link
                href={appStoreLink}
                target="_blank"
                aria-label={`${name} app store link`}
              >
                <AppStore />
              </Link>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default ProjectsCard;
