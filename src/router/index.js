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
import hadBuy from '@/components/pages/hadBuy'
import waitToSendOrders from '@/components/pages/waitToSendOrders'
import refund from '@/components/pages/refund'
import waitToReciveOrders from '@/components/pages/waitToReciveOrders'
import finishOrders from '@/components/pages/finishOrders'


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
				{
					path: '/hadBuy',
					name: 'hadBuy',
					component: hadBuy
				},
				{
					path: '/waitToSendOrders',
					name: 'waitToSendOrders',
					component: waitToSendOrders
				},
				{
					path: '/refund',
					name: 'refund',
					component: refund
				},
				{
					path: '/waitToReciveOrders',
					name: 'waitToReciveOrders',
					component: waitToReciveOrders
				},
				{
					path: '/finishOrders',
					name: 'finishOrders',
					component: finishOrders
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
		},
		
	

		
		
  ]
})
