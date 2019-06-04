import Vue from 'vue'
import Router from 'vue-router'
import shoppingMall from '@/components/pages/shoppingMall'
import register from '@/components/pages/register'
import login from '@/components/pages/login'
import goods from '@/components/pages/goods'
import categoryList from '@/components/pages/categoryList'
import cart from '@/components/pages/cart'
import home from '@/components/pages/home'
import city from '@/components/pages/city'
import personal from '@/components/pages/personal'
import turing from '@/components/pages/turing'


Vue.use(Router)

export default new Router({
  routes: [
		{
			path: '/',
			component: home,
			children:[
				{
					path: '/',
					name: 'shoppingMall',
					component: shoppingMall
				},
				{
					path: '/personal',
					name: 'personal',
					component: personal
				},
				{
					path: '/categoryList',
					name: 'categoryList',
					component: categoryList
				},
				{
					path: '/cart',
					name: 'cart',
					component: cart
				},
				{
					path: '/login',
					name: 'login',
					component: login
				},
				{
					path: '/register',
					name: 'register',
					component: register
				},
				
			]
		},

		
		
		{
			path: '/goods',
			name: 'goods',
			component: goods
		},
		{
			path: '/city',
			name: 'city',
			component: city
		},
		{
			path: '/turing',
			name: 'turing',
			component: turing
		}
	

		
		
  ]
})
