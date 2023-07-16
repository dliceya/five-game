# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


### 1、防止恶意发送验证码

> 思路: 对于登录业务来说，首先验证手机号合法性，其次对单个用户的验证码频率进行限制：每60秒只能发送一次验证码短信（更严格的可以限制没手机号每天的验证码发送次数）

~~~java 
	public Result sendVerificationCode() {
		var userInfo = userRepository.getByMobile(mobile)
		if (userInfo == null) {
			error "该手机号不存在";
		}
		
		var send = redisServer.get(CodeLimitPrefix + mobile);
		if (send != null) {
			error "每分钟仅能发送一次验证码，请稍后重试";
		}
		
		var sendCount = redisServer.get(DayCodeLimitPrefix + mobile + DateUtil.getDay());
		if (sendCount >= MaxSendCount) {
			error "验证码每天最多发送" + MaxSendCount + "，请勿频繁发送";
		}
		

		
		String verificationCode = genCode();
		smsService.sendVerificationCode(mobile, verificationCode);
		redisServer.save(mobile, sendCount + 1, 1 * 60)
		redisServer.save(DayCodeLimitPrefix + mobile + DateUtil.getDay(), (preCount) -> preCount + 1, 24 * 60 * 60)
		.....
		
	}
~~~

### 2、大数据量报表导出

> 思路：首先优化数据查询接口效率，确保没有明显的Sql问题。然后两种思路：异步和ForkJoin，异步实现简单，在我看来也是比较好的办法


