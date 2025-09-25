window.HELP_IMPROVE_VIDEOJS = false;




$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

	

	let globalData = null;
	const transcriptFiles = [
		"transcripts_isiZulu.csv",
		"transcripts_isiXhosa.csv",
		"transcripts_Xitsonga.csv",
		"transcripts_Sesotho.csv",
		"transcripts_Setswana.csv",
		// add more transcript filenames here
		];

		const languageData = {};
		let selectedLanguage = null;

		SideBarGraph(transcriptFiles);

		Promise.all(
		transcriptFiles.map(file =>
			fetch(`./static/csv/${file}`)
			.then(res => res.ok ? res.text() : Promise.reject(`Failed: ${file}`))
			.then(csv => [file, parseCSV(csv)])
		)
		).then(results => {
		results.forEach(([filename, data]) => {
			const keys = Object.keys(data); 
			const lang = filename.split('_')[1].replace('.csv', '');
			const domainCol = data[keys[5]];
			const scriptCol = data[keys[1]];

			if (!languageData[lang]) languageData[lang] = {};

			for (let i = 0; i < domainCol.length; i++) {
			const domain = domainCol[i];
			const script = scriptCol[i];

			// Count domain
			if (!languageData[lang][domain]) languageData[lang][domain] = 0;
			languageData[lang][domain]++;

			// Count script_type
			const key = script === "scripted" ? "_scripted" : "_unscripted";
			if (!languageData[lang][key]) languageData[lang][key] = 0;
			languageData[lang][key]++;
			}
		});

		populateDomainSelect(Object.keys(languageData));
		plotDomainDistribution(languageData);
		}).catch(console.error);

		// Populate dropdown
		function populateDomainSelect(languages) {
		const select = document.getElementById("Domain-category");
		select.innerHTML = "";
		languages.forEach(lang => {
			const opt = document.createElement("option");
			opt.value = lang;
			opt.textContent = lang;
			select.appendChild(opt);
		});

		// Auto-set the first language and trigger default plot
		selectedLanguage = languages[0];
		plotScriptedUnscripted(languageData, selectedLanguage);

		select.addEventListener("change", (e) => {
			selectedLanguage = e.target.value;
			plotScriptedUnscripted(languageData, selectedLanguage);
		});
		}

		// Grouped bar plot: domains across languages
		function plotDomainDistribution(data) {
		const allDomains = new Set();
		Object.values(data).forEach(langObj => {
			Object.keys(langObj).forEach(key => {
			if (!key.startsWith("_")) allDomains.add(key);
			});
		});

		const domains = Array.from(allDomains);
		const traces = Object.entries(data).map(([lang, domainCounts]) => {
			const values = domains.map(domain => domainCounts[domain] || 0);
			return {
			x: domains,
			y: values,
			name: lang,
			type: 'bar'
			};
		});

		const layout = {
			barmode: 'group',
			title: 'Distribution of Domains per Language',
			xaxis: { title: 'Domain' },
			yaxis: { title: 'Words' }
		};

		Plotly.newPlot(document.getElementById("tester"), traces, layout);
		}

		// Single bar plot: scripted vs unscripted
		function plotScriptedUnscripted(data, lang) {
		const counts = data[lang] || {};
		const trace = {
			x: ['Scripted', 'Unscripted'],
			y: [counts["_scripted"] || 0, counts["_unscripted"] || 0],
			type: 'bar',
			marker: { color: ['#4CAF50', '#FFC107'] }
		};

		const layout = {
			title: `Scripted vs Unscripted for "${lang}"`,
			xaxis: { title: 'Type' },
			yaxis: { title: 'Count' }
		};

		Plotly.newPlot(document.getElementById("tester"), [trace], layout);
		}


    function parseCSV(text) {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');

      const rows = lines.slice(1).map(line => line.split(','));

      const result = {};
      headers.forEach((header, i) => {
        result[header] = rows.map(row => {
          const val = row[i].trim();
          return isNaN(val) ? val : parseFloat(val);
        });
      });

      return result;
    }

	function SideBarGraph(transcriptFiles) {

		Promise.all(
			transcriptFiles.map(file =>
				fetch(`./static/csv/${file}`)
					.then(res => res.ok ? res.text() : Promise.reject(`Failed: ${file}`))
					.then(csv => {
						const data = parseCSV(csv);
						const keys = Object.keys(data);
						const lang = file.split('_')[1].replace('.csv', '');
						const totalWords = data[keys[14]]
						.map(val => parseInt(val.toString().replace(/,/g, ""), 10))
						.filter(n => !isNaN(n))
						.reduce((sum, n) => sum + n, 0);
						return [lang, totalWords];
					})
			)
		).then(results => {
			const languages = results.map(([lang]) => lang);
			const wordCounts = results.map(([, count]) => count);

			const trace = {
				y: languages,
				x: wordCounts,
				type: 'bar',
				orientation: 'h',
				name: 'Total Words Provided',
				marker: { color: '#00bcd4' }
			};

			const layout = {
				title: 'Total Words Provided per Language',
				xaxis: { title: 'Total Words Provided' },
				yaxis: { title: 'Language' }
			};

			Plotly.newPlot(document.getElementById("tester2"), [trace], layout);
		}).catch(console.error);
	}


    function plotDomainData(data) {
		const keys = Object.keys(data);
		if (keys.length < 6) {
			alert('CSV must have at least 6 columns for domain data');
			return;
		}

		const domainColumn = data[keys[5]];

		// Count occurrences of each domain
		const counts = {};
		domainColumn.forEach(domain => {
			if (domain in counts) {
			counts[domain]++;
			} else {
			counts[domain] = 1;
			}
		});

		// Sort by frequency and get top 3 domains
		const sortedDomains = Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		

		const topDomains = sortedDomains.map(entry => entry[0]);
		const topCounts = sortedDomains.map(entry => entry[1]);

		updateSelectWithTopDomains(topDomains)

		const trace = {
			x: topDomains,
			y: topCounts,
			type: 'bar',
			marker: { color: 'teal' }
		};

		const layout = {
			title: 'Top 3 Most Common Domains',
			xaxis: { title: 'Domain' },
			yaxis: { title: 'Frequency' }
		};

		const graph = document.getElementById("tester");
		Plotly.newPlot(graph, [trace], layout);
	}

	function plotData(data,index,plotTitle) {
		const keys = Object.keys(data);
		if (keys.length < 6) {
			alert('CSV must have at least 6 columns for domain data');
			return;
		}

		const domainColumn = data[keys[index]];

		// Count occurrences of each domain
		const counts = {};
		domainColumn.forEach(domain => {
			if (domain in counts) {
			counts[domain]++;
			} else {
			counts[domain] = 1;
			}
		});

		// Sort by frequency and get top 3 domains
		const sortedDomains = Object.entries(counts)
			.sort((a, b) => b[1] - a[1])

		

		const topDomains = sortedDomains.map(entry => entry[0]);
		const topCounts = sortedDomains.map(entry => entry[1]);

		// updateSelectWithTopDomains(topDomains)

		const trace = {
			x: topDomains,
			y: topCounts,
			type: 'bar',
			marker: { color: 'teal' }
		};

		const layout = {
			title: plotTitle ,
			xaxis: { title: 'Language' },
			yaxis: { title: 'Frequency' }
		};

		const graph = document.getElementById("tester2");
		Plotly.newPlot(graph, [trace], layout);
	}

	function updateSelectWithTopDomains(domains) {
		const select = document.getElementById("Domain-category");

		// Clear existing options
		select.innerHTML = '';

		// Add new options
		domains.forEach(domain => {
			const option = document.createElement("option");
			option.value = domain;
			option.textContent = domain;
			select.appendChild(option);
		});
	}

	function plotDomainLevel(data){
		const keys = Object.keys(data);
		if (keys.length < 6) {
			alert('CSV must have at least 6 columns for domain/script data');
			return;
		}

		const domainColumn = data[keys[5]]; // Domain column
		const scriptColumn = data[keys[1]]; // Scripted/Unscripted column

		// Get selected domain from dropdown
		const selectedDomain = document.getElementById("Domain-category").value;
		console.log(`SELECTED DOMAIN : ${selectedDomain}`)
		// Count Scripted vs Unscripted for the selected domain
		const scriptCounts = { scripted: 0, unscripted: 0 };

		for (let i = 0; i < domainColumn.length; i++) {
			if (domainColumn[i] === selectedDomain) {
				const label = scriptColumn[i].trim();
				if (label === "scripted" || label === "unscripted") {
					console.log("is inside")
					scriptCounts[label]++;
				}
			}
		}

		// const DomainsCategory = scriptCounts.map(entry => entry[0]);
		// const DomainCounts = scriptCounts.map(entry => entry[1]);

		const trace = {
			x: Object.keys(scriptCounts),
			y: Object.values(scriptCounts),
			type: 'bar',
			marker: { color: ['#4CAF50', '#FFC107'] }
		};

		const layout = {
			title: `Scripted vs Unscripted for "${selectedDomain}"`,
			xaxis: { title: 'Type' },
			yaxis: { title: 'Frequency' }
		};

		Plotly.newPlot(document.getElementById("tester"), [trace], layout);
	}

	function plotLanguageCount(data){
		const keys = Object.keys(data);
		if (keys.length < 6) {
			alert('CSV must have at least 6 columns for domain/script data');
			return;
		}

		const domainColumn = data[keys[8]]; // Domain column
		const scriptColumn = data[keys[1]]; // Scripted/Unscripted column

		// Get selected domain from dropdown
		const selectedDomain = document.getElementById("Domain-category").value;
		console.log(`SELECTED DOMAIN : ${selectedDomain}`)
		// Count Scripted vs Unscripted for the selected domain
		const scriptCounts = { scripted: 0, unscripted: 0 };

		for (let i = 0; i < domainColumn.length; i++) {
			if (domainColumn[i] === selectedDomain) {
				const label = scriptColumn[i].trim();
				if (label === "scripted" || label === "unscripted") {
					console.log("is inside")
					scriptCounts[label]++;
				}
			}
		}

		// const DomainsCategory = scriptCounts.map(entry => entry[0]);
		// const DomainCounts = scriptCounts.map(entry => entry[1]);

		const trace = {
			x: Object.keys(scriptCounts),
			y: Object.values(scriptCounts),
			type: 'bar',
			marker: { color: ['#4CAF50', '#FFC107'] }
		};

		const layout = {
			title: `Scripted vs Unscripted for "${selectedDomain}"`,
			xaxis: { title: 'Type' },
			yaxis: { title: 'Frequency' }
		};

		Plotly.newPlot(document.getElementById("tester"), [trace], layout);
	}


})
