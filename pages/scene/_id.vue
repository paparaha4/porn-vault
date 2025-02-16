<template>
  <div v-if="scene">
    <div class="video-container">
      <video
        controls
        :poster="`/api/media/image/${scene.thumbnail._id}/thumbnail`"
        :src="`/api/media/scene/${scene._id}`"
        style="object-fit: contain"
      ></video>
    </div>

    <div style="padding: 20px">
      <div class="scene-info">
        <div class="main-info">
          <div
            class="scene-title"
            :style="{
              color: primaryColor,
            }"
            :title="scene.name"
          >
            <b>{{ scene.name }}</b>
          </div>
          <div class="release-date" v-if="scene.releaseDate">
            {{ new Date(scene.releaseDate).toLocaleDateString() }}
          </div>
          <div style="margin-top: 5px">
            <Rating :value="scene.rating" />
          </div>
          <div class="subtitle">Labels</div>
          <div style="max-width: 500px">
            <label-group :labels="scene.labels"></label-group>
          </div>
        </div>
        <div style="flex-grow: 1"></div>
        <div v-if="scene.studio">
          <nuxt-link :to="`/studio/${scene.studio._id}`">
            <div v-if="scene.studio.thumbnail">
              <img width="150" :src="`/api/media/image/${scene.studio.thumbnail._id}`" alt="" />
            </div>
            <div v-else style="font-size: 24px">
              <b>
                {{ scene.studio.name }}
              </b>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="marker-grid" style="margin-top: 20px">
        <div @click="showMarkers = !showMarkers" class="subtitle">
          <b>Markers</b>
        </div>
        <div class="body">
          <div v-if="showMarkers">
            <list-container min="150px" max="1fr">
              <div
                style="display: flex; flex-direction: column"
                v-for="marker in scene.markers"
                :key="marker._id"
              >
                <div
                  style="
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                    overflow: hidden;
                    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important;
                  "
                  class="card rounded hover"
                >
                  <img
                    style="display: block; width: 100%; height: auto"
                    :src="`/api/media/image/${marker.thumbnail && marker.thumbnail._id}/thumbnail`"
                  />
                </div>
                <div style="height: 35px; font-size: 16px; margin-top: 10px; text-align: center">
                  <b>{{ marker.name }}</b>
                </div>
              </div>
            </list-container>
          </div>
        </div>
      </div>
      <div class="scene-actors" style="margin-top: 20px">
        <div class="subtitle"><b>Starring</b></div>
        <div class="body">
          <!-- TODO: replace with components using responsive images -->
          <list-container min="150px" max="1fr">
            <div
              style="display: flex; flex-direction: column"
              v-for="actor in scene.actors"
              :key="actor._id"
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-grow: 1;
                  overflow: hidden;
                  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important;
                "
                class="card rounded hover"
              >
                <nuxt-link :to="`/actor/${actor._id}`">
                  <img
                    style="display: block; width: 100%; height: auto"
                    :src="`/api/media/image/${actor.thumbnail && actor.thumbnail._id}/thumbnail`"
                  />
                </nuxt-link>
              </div>
              <div style="font-size: 16px; margin-top: 10px; text-align: center">
                <b>{{ actor.name }}</b>
              </div>
            </div>
          </list-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useRoute,
  ref,
  useFetch,
  useContext,
  useMeta,
  computed,
} from "@nuxtjs/composition-api";
import axios from "axios";

import LabelGroup from "../../components/label_group.vue";
import ListContainer from "../../components/list_container.vue";
import Rating from "../../components/rating.vue";
import { getUrl } from "../../client/util/url";

async function fetchScene(id: string) {
  const { data } = await axios.post(
    getUrl("/api/ql", process.server),
    {
      query: `
        query($id: String!) {
          getSceneById(id: $id) {
            _id
            name
            releaseDate
            bookmark
            rating
            meta {
              duration
            }
            watches
            thumbnail {
              _id
              color
            }
            labels {
              _id
              name
              color
            }
            actors {
              _id
              name
              thumbnail {
                _id
                color
              }
            }
            studio {
              _id
              name
              thumbnail {
                _id
              }
            }
            markers {
              _id
              name
              time
              labels {
                _id
                name
                color
              }
              thumbnail {
                _id
                color
              }
            }
          }
        }
      `,
      variables: {
        id,
      },
    },
    {
      headers: {
        "x-pass": "xxx",
      },
    }
  );

  return data.data.getSceneById as { name: string };
}

export default defineComponent({
  components: {
    ListContainer,
    LabelGroup,
    Rating,
  },
  head: {},
  setup() {
    const { error } = useContext();
    const route = useRoute();
    const { title } = useMeta();

    const scene = ref<any | null>(null);
    const showMarkers = ref(true);

    const primaryColor = computed(() => {
      const sc = scene.value;
      if (!sc) {
        return "black";
      }
      if (!sc.thumbnail) {
        return "black";
      }
      return sc.thumbnail.color;
    });

    useFetch(async () => {
      try {
        scene.value = await fetchScene(route.value.params.id);

        if (!scene.value) {
          return error({
            statusCode: 404,
            message: "Scene not found",
          });
        }

        title.value = scene.value!.name;
      } catch (fetchError) {
        if (!fetchError.response) {
          error({
            statusCode: 500,
            message: "No response",
          });
        } else {
          error({
            statusCode: fetchError.response.status,
            message: fetchError.response.data,
          });
        }
      }
    });

    return { scene, showMarkers, primaryColor };
  },
});
</script>

<style scoped>
video {
  display: block;
  width: 900px;
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.scene-title {
  font-size: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.release-date {
  margin-top: 5px;
  font-weight: 500;
  opacity: 0.75;
}

.video-container {
  display: flex;
  justify-content: center;
  background: black;
}

.scene-info {
  display: flex;
}

.main-info {
  margin-right: 10px;
  overflow: hidden;
}

.subtitle {
  font-weight: bold;
  opacity: 0.75;
  font-size: 16px;
  margin-top: 12px;
  margin-bottom: 5px;
}
</style>
