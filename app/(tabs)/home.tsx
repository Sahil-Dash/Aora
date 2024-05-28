import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, videos } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  SearchInput,
  Trending,
  EmptyState,
  VideoCard,
  Loader,
} from "@/components";

import useApi from "../../lib/useApi";
import { getAllPosts, getLatestPosts } from "@/lib/apis";

const home = () => {
  const { user } = useGlobalContext();

  const { data: posts, loading: postsLoading, refetch } = useApi(getAllPosts);
  const { data: latestPosts, loading: latestLoading } = useApi(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.$oid}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail.uri}
            video={item.video.uri}
            creator={"Sahil"}
            avatar={undefined}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput initaialQuery={""} />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Create videos to see Here"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
