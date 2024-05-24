import { csvParse } from 'd3';

export async function load({fetch}) {
	let data = { studies: [], articles: [], comments: [], references: [], reddit: [], instagram: [] };

	const response = await fetch('src/data/studies.csv');
	const csvStudies = await response.text();
	data.studies = csvParse(csvStudies, d => ({
		title: d.title,
		authors: d.authors, 
		position: d.position,
		url: d.url,
		country: d.country,
		type: d.type,
		year: +d.year,
		radius: +d.participants || 0,
		citations: +d.citations || 0
	}));
	const response_articles = await fetch('src/data/articles.csv');
	const csvArticles = await response_articles.text();
	data.articles = csvParse(csvArticles, d => ({
		title: d.title,
		authors: d.authors, 
		position: d.position,
		publisher: d.publisher,
		url: d.url,
		type: d.type,
		country: d.country,
		year: +d.year,
		radius: +d.backlinks || 0
	}));
	const response_comments = await fetch('src/data/comments.csv');
	const csvComments = await response_comments.text();
	data.comments = csvParse(csvComments, d => ({
		comment: d.comment,
		category: d.category,
		platform: d.platform,
		url: d.url,
		likes: d.likes,
	}));
	const response_references = await fetch('src/data/references.csv');
	const csvReferences = await response_references.text();
	data.references = csvParse(csvReferences, d => ({
		target: d.article,
		authors: d.authors,
		title: d.title,
		date: d.date,
	}));
	const response_reddit = await fetch('src/data/reddit.csv');
	const csvReddit = await response_reddit.text();
	data.reddit = csvParse(csvReddit, d => ({
		comment: d.comments,
		position: d.position,
		radius: d.upVotes,
		url: d.url,
		username: d.username,
		type: d.type,
	}));
	const response_instagram = await fetch('src/data/instagram.csv');
	const csvInstagram = await response_instagram.text();
	data.instagram = csvParse(csvInstagram, d => ({
		position: d.position,
		radius: d.followerCount,
		url: d.url,
		username: d.username,
		type: d.type,
	}));

	return { data };
}