import { VuexModule, Module, Mutation } from "vuex-class-modules";
import IScene from "@/types/scene";
import IActor from "@/types/actor";

@Module
class SceneModule extends VuexModule {
  current = null as IScene | null;

  @Mutation
  popWatch() {
    if (this.current) this.current.watches.pop();
  }

  @Mutation
  pushWatch(stamp: number) {
    if (this.current) this.current.watches.push(stamp);
  }

  @Mutation
  setName(name: string) {
    if (this.current) {
      this.current.name = name;
    }
  }

  @Mutation
  setPath(path: string) {
    if (this.current) {
      this.current.path = path;
    }
  }

  @Mutation
  setDescription(description: string) {
    if (this.current) {
      this.current.description = description;
    }
  }

  @Mutation
  setCurrent(current: any) {
    this.current = current;
  }

  @Mutation
  setFavorite(bool: boolean) {
    if (this.current) {
      this.current.favorite = bool;
    }
  }

  @Mutation
  setBookmark(dateValue: number | null) {
    if (this.current) {
      this.current.bookmark = dateValue;
    }
  }

  @Mutation
  setRating(rating: number) {
    if (this.current) {
      this.current.rating = rating;
    }
  }

  @Mutation
  setThumbnail(id: string) {
    if (this.current) {
      if (!this.current.thumbnail) this.current.thumbnail = { _id: id, color: null };
      else this.current.thumbnail._id = id;
    }
  }

  @Mutation
  setLabels(labels: { _id: string; name: string }[]) {
    if (this.current) this.current.labels = labels;
  }

  @Mutation
  setStreamLinks(streamLinks: string[]) {
    if (this.current) this.current.streamLinks = streamLinks;
  }

  @Mutation
  setStudio(studio: any) {
    if (this.current) this.current.studio = studio;
  }

  @Mutation
  setReleaseDate(val: number | null) {
    if (this.current) this.current.releaseDate = val;
  }

  @Mutation
  setActors(actors: IActor[]) {
    if (this.current) this.current.actors = actors;
  }

  @Mutation
  setCustomFields(fields: any) {
    if (this.current) this.current.customFields = fields;
  }
}

import store from "./index";
export const sceneModule = new SceneModule({ store, name: "scenes" });
