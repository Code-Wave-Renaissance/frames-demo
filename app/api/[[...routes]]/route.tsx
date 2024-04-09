/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { TaskDataType } from '@/data/answer'

const mockTaskData: TaskDataType = {
	id: "",
	fid: 0,
	displayName: "",
	pfpUrl: "",
	title: "",
	description: "",
	price: 0,
	verifiedAddresses: {
		ethAddresses: [],
		solAddresses: []
	},
	applicants: [],
	status: "open",
	dealWith: "",
};

// super basic random id generator
function generateRandomId(): string {
	const timestamp = Date.now().toString(36);
	const randomString = Math.random().toString(36).substring(2, 7);
	return timestamp + randomString;
}

async function createTask(taskData: TaskDataType) {

	const id = generateRandomId();

	taskData.id = id;

	try {
		const response = await fetch(`${process.env.API_URL || "http://localhost:3000"}/api/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(taskData),
		});

		if (!response.ok) {
			throw new Error('Failed to create task');
		}

		const result = await response.text(); // or response.json() if your server responds with JSON
		console.log(result); // Handle success
	} catch (error) {
		console.error("Error creating task:", error);
	}
}

async function applyTask({ id, displayName, verifiedAddresses, fid, pfpUrl }: any) {
	try {
		const response = await fetch(`${process.env.API_URL || "http://localhost:3000"}/api/add-applicants/${id || "foQiyt3GaSdnD8Dv9nXI"}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				displayName: displayName,
				address: verifiedAddresses.solAddresses[0] || "C0Boifj3GaSdnD8Dv9nXI",
				pfpUrl: pfpUrl,
				fid: fid
			}),
		});
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error(error);
	}
	console.log('Update task not ready yet')
}

async function searchTask(id: string) {
	try {
		const response = await fetch(`${process.env.API_URL || "http://localhost:3000"}/api/task/${id}`);
		console.log(response);
		if (response.ok) {
			const data = await response.json();

			return data;
		} else {
			console.error('Failed to fetch data');
			// throw new Error('Failed to fetch data');
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const neynarMiddleware = neynar({
	apiKey: 'NEYNAR_FROG_FM',
	features: ['interactor', 'cast'],
})

const app = new Frog({
	assetsPath: '/',
	basePath: '/api',
	imageAspectRatio: '1.91:1',
	// Supply a Hub to enable frame verification.
	// hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
}).frame('/', (c) => {
	return c.res({
		// image: 'https://i.ibb.co/GnbS9TV/taskflow-banner-V4.png',
		image: (
			<div
				style={{
					alignItems: 'center',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',
					// backgroundColor: 'white',
					height: '100%',
					width: '100%',
				}}
			>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 80,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',

				}}>I'm looking for an</p>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 160,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',

				}}>NFT artist</p>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 100,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',

				}}>for $404.00</p>
			</div>
		),
		intents: [
			<Button value='search' action='/search'>Search other Task</Button>,
			<Button value='apply' action='/apply'>Apply</Button>,
			<TextInput placeholder="Search by iD or Tag" />,
		],
	})
}).frame('/apply', neynarMiddleware, (c) => {
	const { displayName, verifiedAddresses, pfpUrl, fid } = c.var.interactor || {}
	const { inputText, buttonValue } = c;
	applyTask({ inputText, displayName, verifiedAddresses, fid, pfpUrl });
	return c.res({
		image: (
			<div
			style={{
					alignItems: 'center',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',
					// backgroundColor: 'white',
					height: '100%',
					width: '100%',
				}}
				>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 100,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',
				}}>Thanks for Applying🎉</p>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 80,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',
				}}>Now you can keep scrolling😉</p>
			</div>
		),
		intents: [
			// <Button value='return' action='/'>↩️ Return</Button>,
			<Button.Redirect location="https://taskflow-red.vercel.app/">or Check our Platform ⭐</Button.Redirect>,
		],
	})
}).frame('/search', neynarMiddleware, (c) => {
	const { inputText, buttonValue } = c;

	// IMPLEMENT THIS FUNCTION
	// const task = searchTask(inputText as string);

	return c.res({
		image: (
			<div
				style={{
					alignItems: 'center',
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',
					// backgroundColor: 'white',
					height: '100%',
					width: '100%',
				}}
				>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 160,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',
				}}>Job: {"MVP Hack"}</p>
				<p style={{
					marginTop: 0,
					color: 'transparent',
					fontFamily: 'fantasy',
					fontWeight: 900,
					fontSize: 160,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',
				}}>for: {"$160"}</p>
			</div>
		),
		intents: [
			<Button.Reset>↩️ Return</Button.Reset>,
			<Button value='apply' action='/apply'>Apply</Button>,
		],
	})
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
