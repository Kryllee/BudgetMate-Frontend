import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../src/api';

const COLORS = {
    background: '#141326',
    cardBg: '#433DA3',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
};

const CATEGORIES = [
    { id: 'all', label: 'All', color: COLORS.yellow },
    { id: 'budgeting', label: 'Budgeting', color: COLORS.yellow },
    { id: 'savings', label: 'Savings', color: COLORS.primary },
    { id: 'side-hustles', label: 'Side Hustles', color: COLORS.yellow },
    { id: 'mental-health', label: 'Mental Health', color: COLORS.text },
];

const Community = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [])
    );

    const loadPosts = async () => {
        try {
            const response = await api.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error loading posts:', error);
            Alert.alert('Error', 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    // Filter posts based on selected category
    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post =>
            post.category.toLowerCase() === selectedCategory.toLowerCase() ||
            post.category.toLowerCase().replace(' ', '-') === selectedCategory
        );

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/api/posts/${postId}/like`);
            // Update the post in the list
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? response.data : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
            Alert.alert('Error', 'Failed to like post');
        }
    };

    const handleComment = async (post) => {
        Alert.prompt(
            'Add Comment',
            `Comment on "${post.title}"`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Post',
                    onPress: async (text) => {
                        if (!text || !text.trim()) return;

                        try {
                            const response = await api.post(`/api/posts/${post._id}/comment`, {
                                text: text.trim()
                            });
                            setPosts(prevPosts =>
                                prevPosts.map(p =>
                                    p._id === post._id ? response.data : p
                                )
                            );
                            Alert.alert('Success', 'Comment posted!');
                        } catch (error) {
                            console.error('Error posting comment:', error);
                            Alert.alert('Error', 'Failed to post comment');
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const handleShare = (post) => {
        Alert.alert(
            'Share Post',
            `Share "${post.title}" with your friends?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Share',
                    onPress: () => {
                        Alert.alert('Shared!', 'Post shared successfully!');
                    }
                }
            ]
        );
    };

    const handlePostClick = (post) => {
        const commentsText = post.comments.length > 0
            ? `\n\nComments (${post.comments.length}):\n` +
            post.comments.slice(0, 3).map(c => `• ${c.text}`).join('\n')
            : '';

        Alert.alert(
            post.title,
            `${post.content}${commentsText}\n\nPosted by ${post.user?.username || 'Unknown'}`,
            [{ text: 'Close', style: 'cancel' }]
        );
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${diffDays}d`;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Communities</Text>
                    <Text style={styles.subtitle}>Connect with others on their financial journey</Text>
                </View>

                {/* Category Filter Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryPill,
                                selectedCategory === category.id && styles.categoryPillActive,
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category.id && styles.categoryTextActive,
                                ]}
                            >
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Posts */}
                <View style={styles.postsContainer}>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => {
                            const isLiked = post.likes && post.likes.some(like => like === global.userId);
                            const categoryColor = CATEGORIES.find(c =>
                                c.label.toLowerCase() === post.category.toLowerCase()
                            )?.color || COLORS.yellow;

                            return (
                                <TouchableOpacity
                                    key={post._id}
                                    style={styles.postCard}
                                    onPress={() => handlePostClick(post)}
                                >
                                    {/* User Info */}
                                    <View style={styles.postHeader}>
                                        <View style={styles.avatar} />
                                        <View style={styles.postHeaderText}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.postTitle} numberOfLines={1}>
                                                    {post.title}
                                                </Text>
                                                <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                                                    <Text style={styles.categoryBadgeText}>{post.category}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.postMeta}>
                                                {post.user?.username || 'Anonymous'} · {getTimeAgo(post.createdAt)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Post Content */}
                                    <Text style={styles.postContent} numberOfLines={2}>
                                        {post.content}
                                    </Text>

                                    {/* Engagement Metrics */}
                                    <View style={styles.postFooter}>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleComment(post)}
                                        >
                                            <MaterialIcons name="chat-bubble-outline" size={moderateScale(18)} color={COLORS.textSecondary} />
                                            <Text style={styles.engagementText}>{post.comments?.length || 0}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleLike(post._id)}
                                        >
                                            <MaterialIcons
                                                name={isLiked ? "favorite" : "favorite-border"}
                                                size={moderateScale(18)}
                                                color={isLiked ? COLORS.accent : COLORS.textSecondary}
                                            />
                                            <Text style={[
                                                styles.engagementText,
                                                isLiked && { color: COLORS.accent }
                                            ]}>{post.likes?.length || 0}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleShare(post)}
                                        >
                                            <MaterialIcons name="share" size={moderateScale(18)} color={COLORS.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No posts in this category yet</Text>
                            <Text style={styles.emptyStateSubtext}>Be the first to post!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/CreatePost')}
                activeOpacity={0.8}
            >
                <MaterialIcons name="add" size={moderateScale(28)} color={COLORS.text} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: scale(20),
        paddingBottom: verticalScale(120),
    },
    header: {
        marginBottom: verticalScale(20),
    },
    title: {
        fontSize: moderateScale(28),
        fontFamily: 'Poppins-Bold',
        color: COLORS.yellow,
        marginBottom: verticalScale(4),
    },
    subtitle: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
    categoriesContainer: {
        marginBottom: verticalScale(20),
        maxHeight: verticalScale(40),
    },
    categoriesContent: {
        paddingRight: scale(20),
    },
    categoryPill: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        marginRight: scale(8),
        height: verticalScale(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryPillActive: {
        backgroundColor: COLORS.yellow,
        borderColor: COLORS.yellow,
    },
    categoryText: {
        fontSize: moderateScale(13),
        color: COLORS.textSecondary,
        fontFamily: 'Poppins-Medium',
    },
    categoryTextActive: {
        color: COLORS.background,
        fontFamily: 'Poppins-SemiBold',
    },
    postsContainer: {
        gap: verticalScale(16),
    },
    postCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(16),
    },
    postHeader: {
        flexDirection: 'row',
        marginBottom: verticalScale(12),
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: COLORS.textSecondary,
        marginRight: scale(12),
    },
    postHeaderText: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
        gap: scale(8),
    },
    postTitle: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
        flex: 1,
    },
    categoryBadge: {
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(12),
    },
    categoryBadgeText: {
        fontSize: moderateScale(10),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.background,
    },
    postMeta: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
    postContent: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.text,
        lineHeight: moderateScale(20),
        marginBottom: verticalScale(12),
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(16),
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    engagementText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(60),
    },
    emptyStateText: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
        marginBottom: verticalScale(8),
    },
    emptyStateSubtext: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
    fab: {
        position: 'absolute',
        bottom: verticalScale(20),
        right: scale(20),
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(28),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default Community;