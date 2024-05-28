import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { searchPosts } from "@/lib/apis";
import { useLocalSearchParams } from "expo-router";

const search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();

  const {
    data: posts,
    loading: postsLoading,
    refetch,
  } = useApi(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

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
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Search reasults for:
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="" />
        )}
      />
    </SafeAreaView>
  );
};

export default search;

const styles = StyleSheet.create({});
