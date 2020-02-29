<!-- import zanui -->
<import src="../../zanui/loadmore/index.wxml" />
<!--index.wxml-->
<view class="container">
  <view class="page-body">
    <view class="page__bd">
      <view class="forum">
        <view class="forum_info">
          <view class="forum_title">{{forum_data.name}}</view>
          <view class="forum_note">主题：{{forum_data.threads}} 帖子：{{forum_data.posts}}</view>
        </view>
        <view wx:if="{{has_top}}" class="top_subject">
          <view class="zan-tag zan-tag--primary">置顶贴</view>
          <block wx:for="{{few_top_thread_data}}" wx:for-item="item" wx:key="">
            <view class="zan-ellipsis" bindtap="toDetail" data-tid="{{item.tid}}">{{item.subject}}</view>
         </block>
         <block wx:if="{{show_more}}">
           <view class="top_subject_item" bindtap="show_more_top">查看更多</view>
         </block>
       </view>
      </view>

      <view>
        <view class="thread_order">
          <view class="thread_order_item {{ recent == 1 ? 'thread_order_border' : '' }}" bindtap="get_recent_thread">最新</view>
          <view class="thread_order_item {{ order_by_views == 1 ? 'thread_order_border' : '' }}" bindtap="get_hot_thread">热门</view>
          <view class="thread_order_item {{ digest == 1 ? 'thread_order_border' : '' }}" bindtap="get_digest_thread">精华</view>
        </view>
        <block wx:for="{{articleList}}" wx:for-item="article" wx:key="">
          <view class="article" bindtap="toDetail" data-tid="{{article.tid}}">
            <view class="article-content">
              <view class="article-header">
                <view class="article-author-avatar">
                  <image src='{{article.avatar}}'></image>
                </view>
                <view class="article-side-header">
                  <view class="article-sub-header">
                    <view class="article-title">{{article.subject}}</view>
                  </view>
                  <view class="article-info">
                    <view class="article-by">by</view>
                    <view class="article-author">{{article.author}}</view>   
                    <!-- <view class="article-in">in</view> -->
                    <!-- <view class="article-fid-item">{{article.fid_name}}</view> -->
                  </view>
                </view>
              </view>
              <!-- 注释掉图片和主体内容 -->
              <block wx:if="{{!lite_switch}}">
                <block wx:if="{{article.image_list.length > 0}}">
                  <view  class="article-img">
                    <view class="article-img-info">
                      <image class="article-img-item" src='{{article.image_list[0]}}'></image>
                    </view>
                  </view>
                </block>
                <block wx:if="{{article.message}}">
                <view class="article-message">
                  {{article.message}}
                </view>
                </block>
              </block>
            <view class="article-ext-info">
              <view class="article-re">
                <view class="zan-icon zan-icon-password-view"></view> 
                <view>{{article.views}}</view>
                <view class="zan-icon zan-icon-chat"></view>
                <view>{{article.replies}}</view>
              </view>
              <view class="article-post-time">{{article.create_time}}</view>              
            </view>
          </view>
          </view>
        </block>
      </view>
    </view>
    <!-- 加载更多 -->
    <template is="zan-loadmore" data="{{ loading : have_data}}"></template>
    <!-- 没有可以显示的数据 -->
    <template is="zan-loadmore" data="{{ nodata: no_data }}"></template>
    <!-- 没有更多的数据了 -->
    <template is="zan-loadmore" data="{{ nomore :nomore_data}}"></template>
    <!--
    <view class="edit-cell" bindtap="toAddArticle">
      <image class="edit-cell-img" src="../../resources/image/edit.png"/>
    </view>
    -->
    <block wx:if="{{scroll_show}}">
    <view class="scroll-to-top" bindtap="scrollToTop">
      <image class="scroll-to-top-img" src="../../resources/image/top.png"/>
    </view>
    </block>
  </view>
</view>