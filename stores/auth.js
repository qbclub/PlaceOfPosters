import { defineStore } from 'pinia'
import AuthService from '../service/AuthService'

export const useAuth = defineStore('auth', {
	state: () => ({
		isAuth: false,
		user: null,
		authRefreshing: false,
	}),
	getters: {
	},
	actions: {
		async resetPassword(password, token, user_id) {
			let response = await AuthService.resetPassword(password, token, user_id)
			if (response.data.accessToken && process.client)
				localStorage.setItem('token', response.data.accessToken);

			this.isAuth = true
			this.user = response.data.user
		},
		async forgotPassword(email) {
			try {
				let response = await AuthService.forgotPassword(email);
				return response
			} catch (error) {
				console.log(error);
			}
		},
		async updateUser(user) {
			try {
				return await AuthService.updateUser(user)
			} catch (err) {
				return err
			}
		},
		async registration(form) {
			try {
				const response = await AuthService.registration(form);
				if (response.data.accessToken)
					localStorage.setItem('token', response.data.accessToken);
				if (response.data.user) {
					this.isAuth = true
					this.user = response.data.user
				}

				return true
			} catch (err) {
				return err
			}
		},
		async login(form) {
			try {
				const response = await AuthService.login(form);
				if (response.data.accessToken)
					localStorage.setItem('token', response.data.accessToken);
				if (response.data.user) {
					this.isAuth = true;
					this.user = response.data.user
				}

				return true
			} catch (err) {
				return err
			}
		},
		async checkAuth() {
			try {
				if (this.authRefreshing) return
				this.authRefreshing = true
				const response = await AuthService.refresh()
				if (!response.data?.accessToken && !response.data?.user) return

				if (process.client)
					localStorage.setItem('token', response.data.accessToken)
				this.isAuth = true
				this.user = response.data.user
				this.authRefreshing = false
			} catch (err) {
			}
		},
		async logout() {
			try {
				const response = await AuthService.logout();
				localStorage.removeItem('token');

				this.isAuth = false;
				this.user = null
			} catch (err) {
				console.log(err);
			}
		},
		async buyPosters(buyEvent) {
			try {
				buyEvent._id = this.user._id
				let response = await AuthService.buyPosters(buyEvent)
				return response
			} catch (error) {
				console.log(error);
			}
		},
		async getSubscriptionCount(_id) {
			try {
				let response = await AuthService.getSubscriptionCount(_id)
				this.user.subscription.count = response.data.subscription.count
			
			} catch (error) {
				console.log(error);
			}
		}
	},
})