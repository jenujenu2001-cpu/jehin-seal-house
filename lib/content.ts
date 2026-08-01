import fs from "fs/promises";
import path from "path";
import { getMongoClientPromise, getDbName } from "./mongodb";

const COLLECTION_NAME = "siteContent";
const DOC_ID = "main";

const SEED_PATH = path.resolve(
  process.cwd(),
  "data",
  "content.json"
);

export type CategoryTheme =
  | "school"
  | "gift"
  | "print"
  | "creative"
  | "photo";


export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  publicId?: string;
}

export interface Category {
  id: string;
  name: string;
  theme: CategoryTheme;
  description: string;
  images: GalleryImage[];
}

export interface BusinessHours {
  day: string;
  time: string;
}

export interface Business {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapEmbedUrl: string;
  mapLink: string;
  hours: BusinessHours[];
  social: {
    facebook: string;
    instagram: string;
  };
}


export interface Hero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}


export interface WhyChooseUsItem {
  title: string;
  detail: string;
}


export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}


export interface SiteContent {
  business: Business;
  hero: Hero;
  whyChooseUs: WhyChooseUsItem[];
  testimonials: Testimonial[];
  categories: Category[];
}


interface StoredDocument extends SiteContent {
  _id: string;
}


async function getCollection() {

  const client = await getMongoClientPromise();

  return client
    .db(getDbName())
    .collection<StoredDocument>(COLLECTION_NAME);

}



async function loadSeedContent(): Promise<SiteContent> {

  try {

    const raw = await fs.readFile(
      SEED_PATH,
      "utf-8"
    );

    return JSON.parse(raw);

  } catch (error) {

    console.error(
      "Seed file loading failed:",
      SEED_PATH,
      error
    );

    throw new Error(
      "content.json missing. Please check data/content.json"
    );

  }

}



export async function getContent(): Promise<SiteContent> {


  const collection = await getCollection();


  const doc = await collection.findOne({
    _id: DOC_ID
  });



  if(doc){

    const {
      _id,
      ...content
    } = doc;


    return content;

  }



  const seed = await loadSeedContent();



  await collection.updateOne(
    {
      _id: DOC_ID
    },
    {
      $setOnInsert:{
        _id: DOC_ID,
        ...seed
      }
    },
    {
      upsert:true
    }
  );



  const finalDoc =
    await collection.findOne({
      _id:DOC_ID
    });



  if(finalDoc){

    const {
      _id,
      ...content
    } = finalDoc;


    return content;

  }



  return seed;

}





export async function saveContent(
  content: SiteContent
): Promise<void>{


  const collection =
    await getCollection();


  await collection.updateOne(
    {
      _id:DOC_ID
    },
    {
      $set:content
    },
    {
      upsert:true
    }
  );


}





export async function getCategory(
 id:string
):Promise<Category|undefined>{


 const content =
   await getContent();


 return content.categories.find(
   c=>c.id===id
 );


}




export function slugify(input:string){

 return input
 .toLowerCase()
 .trim()
 .replace(/[^a-z0-9]+/g,"-")
 .replace(/(^-|-$)+/g,"");

}