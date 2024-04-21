const { SlashCommandBuilder } = require('discord.js');

// If the file is missing, go to https://github.com/Vision2Jeu/RecipesScraper
// Then, run the script and get the file
const minecraft = require('./_images_data.json');
const minecraft_name = minecraft.map(item => item['image_name']);

function optimalStringAlignmentDistance(s1, s2) {

	// Create a table to store the results of subproblems
	let dp = new Array(s1.length + 1).fill(0)
		.map(() => new Array(s2.length + 1).fill(0));


	// Initialize the table
	for (let i = 0; i <= s1.length; i++) {
		dp[i][0] = i;
	}
	for (let j = 0; j <= s2.length; j++) {
		dp[0][j] = j;
	}

	// Populate the table using dynamic programming
	for (let i = 1; i <= s1.length; i++) {
		for (let j = 1; j <= s2.length; j++) {
			if (s1[i - 1] === s2[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			}
			else {
				dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
			}
		}
	}

	// Return the edit distance
	return dp[s1.length][s2.length];
}

function sortItems(items, input) {
	return items.map(item => ({
		item,
		prefixMatch: item.toLowerCase().startsWith(input.toLowerCase()) ? 0 : 1,
		distance: optimalStringAlignmentDistance(input, item)
	})).sort((a, b) => {
		if (a.prefixMatch === b.prefixMatch) {
			return a.distance - b.distance; 
		}
		return a.prefixMatch - b.prefixMatch;  // Prioritize prefix matches
	}).map(i => i.item);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('howto')
		.setDescription('Provides information about a craft in minecraft.')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('Version to search in')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'item') {
			choices = minecraft_name;
		}

		const filtered = sortItems(minecraft_name, focusedOption.value);

		await interaction.respond(
			filtered.slice(0,10).map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		
		const itemToCraft = interaction.options.getString("item");
		const itemWanted = minecraft.find(item => item.image_name === itemToCraft);
		
		if (!itemWanted) {
			const filtered = sortItems(minecraft_name, itemToCraft);
			console.log(filtered)
			const replacementItem = filtered[0];

			const newItem = minecraft.find(item => item.image_name === replacementItem);

			await interaction.reply(`tu m'as dis de la merde mais tiens : https://www.minecraftcrafting.info/imgs/${newItem.image_file_name}`);
		} else {
			await interaction.reply(`https://www.minecraftcrafting.info/imgs/${itemWanted.image_file_name}`);
		}
	},
};
