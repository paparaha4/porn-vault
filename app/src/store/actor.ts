import { VuexModule, Module, Mutation } from "vuex-class-modules";

@Module
class ActorModule extends VuexModule {
  current = null as IActor | null;

  @Mutation
  setNationality(nation: any) {
    if (this.current) this.current.nationality = nation;
  }

  @Mutation
  setName(name: string) {
    if (this.current) this.current.name = name;
  }

  @Mutation
  setDescription(description: string) {
    if (this.current) this.current.description = description;
  }

  @Mutation
  setAliases(aliases: string[]) {
    if (this.current) this.current.aliases = aliases;
  }

  @Mutation
  setCurrent(current: any) {
    this.current = current;
  }

  @Mutation
  setFavorite(bool: boolean) {
    if (this.current) this.current.favorite = bool;
  }

  @Mutation
  setBookmark(dateValue: number | null) {
    if (this.current) this.current.bookmark = dateValue;
  }

  @Mutation
  setRating(rating: number) {
    if (this.current) this.current.rating = rating;
  }

  @Mutation
  setBornOn(date: number | null) {
    if (this.current) this.current.bornOn = date;
  }
  
  @Mutation
  setAge(age: number | null) {
    if (this.current) this.current.age = age;
  }

  @Mutation
  setThumbnail(id: string | null) {
    if (this.current) {
      if (id) {
        if (!this.current.thumbnail) this.current.thumbnail = { _id: id, color: null };
        this.current.thumbnail._id = id;
      } else {
        this.current.thumbnail = null;
      }
    }
  }

  @Mutation
  setAltThumbnail(id: string | null) {
    if (this.current) {
      if (id) {
        if (!this.current.altThumbnail) this.current.altThumbnail = { _id: id, color: null };
        this.current.altThumbnail._id = id;
      } else {
        this.current.altThumbnail = null;
      }
    }
  }

  @Mutation
  setAvatar(id: string | null) {
    if (this.current) {
      if (id) {
        if (!this.current.avatar) this.current.avatar = { _id: id, color: null };
        this.current.avatar._id = id;
      } else {
        this.current.avatar = null;
      }
    }
  }

  @Mutation
  setHero(id: string | null) {
    if (this.current) {
      if (id) {
        if (!this.current.hero) this.current.hero = { _id: id, color: null };
        this.current.hero._id = id;
      } else {
        this.current.hero = null;
      }
    }
  }

  @Mutation
  setLabels(labels: { _id: string; name: string }[]) {
    if (this.current) this.current.labels = labels;
  }

  @Mutation
  setCustomFields(fields: any) {
    if (this.current) this.current.customFields = fields;
  }
}

import store from "./index";
import IActor from "@/types/actor";
export const actorModule = new ActorModule({ store, name: "actors" });
