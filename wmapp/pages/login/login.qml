<!--pages/login/login.wxml-->
<view class="container">
  	<view class="page-body">
      <view class="page-head image-logo">
        <image src='../../resources/logo/mouldbbs300.jpg'></image>
      </view>
  		<view class="weui-cells cells-no-border">
  			<view class="weui-cell weui-cell_input">
	          <view class="weui-cell__hd">
	            <view class="weui-label">账号</view>
	          </view>
	          <view class="weui-cell__bd">
	            <input class="weui-input" type="text" placeholder="请输入账号" bindinput="inputUsername"></input>
	          </view>
	        </view>

	        <view class="weui-cell weui-cell_input">
	          <view class="weui-cell__hd">
	            <view class="weui-label">密码</view>
	          </view>
	          <view class="weui-cell__bd">
	            <input class="weui-input" type="password" placeholder="请输入密码" bindinput="inputPassword"></input>
	          </view>
	        </view>
	  		
		</view>

		<view class="btn-area">
        	<button class="weui-btn" type="primary" bindtap="clickLogin">登录</button>
      	</view>

  	</view>
</view>
