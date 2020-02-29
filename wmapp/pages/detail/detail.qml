<!--detail.wxml-->
<import src="/wxParse/wxParse.wxml"/>
<view class="header-fix">
  <view class="fix-btn" bindtap='toIndex'><image class="detail-icon" src='/resources/icon/index.png' />首页</view>
  <button class="fix-btn share-btn" open-type='share'>
  <image class="detail-icon" src='/resources/icon/share.png' />分享
  </button>
</view>
<view class="container">
  <loading hidden="{{loading_hidden}}">
    {{loading_msg}}
  </loading>

  <view class="page-body">
    <view class="page__bd">
      <view class="thread_title-cell">
        <view class="thread_data-title">{{thread_data.subject}}</view>
        <view class="thread_data-sub">
          <view class="thread_data-info">
              <view class="zan-icon zan-icon-password-view"></view> 
              <view>{{thread_data.views}}</view>
              <view class="zan-icon zan-icon-chat"></view>
              <view>{{thread_data.replies}}</view>
          </view>
          <block wx:if="{{thread_data.fid_name}}">
            <view class="thread_data-fid">{{thread_data.fid_name}}</view>
          </block>
          <block wx:else>
            <view class="thread_data-fid">群组</view>
          </block>
        </view>
      </view>
      <view>
          <block wx:if="{{newpost}}">
          <view class="article new-post">
            <view class="article-info">
              <view class="article-author">
                <view class="article-author-info">
                  <view>{{username}}</view>
                  <view>{{time}}</view>
                </view>
              </view>
              <view class="article-author-position">
                <view>发表成功</view>
              </view>
            </view>
            <view>{{post_message}}</view>
          </view>
        </block>
      </view>
      <view class="thread_content-cell">
        <view class="article-info">
          <view class="article-author">
            <view class="article-author-avatar">
              <image class="article-author-icon" src="{{thread_data.author_avatar}}"/>
            </view>
            <view class="article-author-info">
              <view>{{thread_data.author}}</view>
              <view>{{thread_data.create_time}}</view>
            </view>
          </view>
          <view class="article-author-position">
            <view>楼主</view>
          </view>
        </view>

        
        <template is="wxParse" data="{{wxParseData:thread_data.message.nodes}}"/>
        <!-- <text>
          {{thread_data.message}}
        </text> -->
        <view>
          <block wx:for="{{thread_data.image_list}}" wx:for-item="image" wx:key="imageId" >
            <view>
              <image class="thread_image" mode="widthFix" src="{{image}}" data-src="{{image}}" data-image_list="{{thread_data.image_list}}" bindtap="previewImage"></image>
            </view>
          </block>
        </view>
      </view>
      <block wx:if="{{thread_data.un_image_attach || thread_data.price != 0}}">
      <view class="extend-notice">
        <block wx:if="{{thread_data.un_image_attach}}">
        <view class="alert">本帖有 {{thread_data.un_image_attach}} 个附件可供下载</view>
        </block>
        <block wx:if="{{thread_data.price != 0}}">
        <view class="alert">本帖售价为 {{thread_data.price}} 模币</view>
        </block>
        <view class="to-mould">请移步至<text>中国模具论坛</text>官网，进行查看。</view>
      </view>
      </block>
      <view>
        <view class="resp-head">全部回复（{{thread_data.replies}}）</view>
        <block wx:for="{{articleList}}" wx:for-index="articleIndex" wx:for-item="article" wx:key="articleId">
          <view class="article">
            <view class="article-info">
              <view class="article-author">
                <view>
                  <image class="article-author-icon" src="{{article.author_avatar}}"/>
                </view>
                <view class="article-author-info">
                  <view>{{article.author}}</view>
                  <view>{{article.create_time}}</view>
                </view>
              </view>
              <view class="article-author-position">
                <view>{{article.position}}楼</view>
              </view>
            </view>
              <block wx:for="{{replyTemArray}}" wx:key="">
                <block wx:if="{{index == articleIndex}}">
                  <template is="wxParse" data="{{wxParseData:item}}"/>
                  <block wx:if="{{article.post_image_list}}">
                    <block wx:for="{{article.post_image_list}}" wx:for-index="idx" wx:key="">
                      <view>
                        <image class="thread_image" mode="widthFix" src="{{article.post_image_list[idx]}}" data-src="{{article.post_image_list[idx]}}" data-image_list="{{article.post_image_list}}" bindtap="previewImage"></image>
                      </view>
                    </block>
                  </block>
                </block>
              </block>
          </view>
        </block>
        <view class="page-tail-space"></view>
      </view>
    </view>
  </view>
  <view class="page-tail">
      <block wx:if="{{login_flag}}">
      <view class="resp-input-cell">
        <input class="resp-input" type="text" placeholder="说点什么吧..." bindinput="input_message" value="{{message}}"/>
      </view>
      <view class="resp-btn" bindtap="submit_message">回复</view>
      </block>
      <block wx:else>
        <navigator class="need-login" url="/pages/login/login">点此处登录之后，即可回复本帖</navigator>
      </block>
  </view>
  <block wx:if="{{scroll_show}}">
    <view class="scroll-to-top" bindtap="scrollToTop">
      <image class="scroll-to-top-img" src="../../resources/image/top.png"/>
    </view>
  </block>
</view>