fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
    .then((response) => response.json())
    .then((data) => {
        // fetch gdp data array from json
        const gdp = data.data.map((elem) => [new Date(elem[0]), elem[1]]);

        // create svg canvas
        const svg = d3.select('.canvas');
        const svgWidth = document.querySelector('.canvas').clientWidth;
        const svgHeight = document.querySelector('.canvas').clientHeight;
        const padding = 60;

        // set x and y scales
        const xScale = d3
            .scaleLinear()
            .domain([d3.min(gdp, (d) => d[0]), d3.max(gdp, (d) => d[0])])
            .range([padding, svgWidth - padding]);
        const yScale = d3
            .scaleLinear()
            .domain([0, Math.ceil(d3.max(gdp, (d) => d[1]) / 2000) * 2000])
            .range([svgHeight - padding, padding]);

        // create axes
        const xAxis = d3
            .axisBottom(xScale)
            .tickValues(d3.timeYears(new Date(Math.ceil(d3.min(gdp, (d) => d[0]).getFullYear() / 5) * 5, 0), d3.max(gdp, (d) => d[0]), 5))
            .tickFormat(d3.timeFormat('%Y'));
        const yAxis = d3.axisLeft(yScale);
        yAxis.ticks(4);
        svg
            .append('g')
            .attr('transform', `translate(0, ${svgHeight - padding})`)
            .attr('id', 'x-axis')
            .call(xAxis);
        svg
            .append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('id', 'y-axis')
            .call(yAxis);

        // add y-axis title
        svg
            .append('text')
            .attr('x', -240)
            .attr('y', padding + 20)
            .text('Gross Domestic Product')
            .style('transform', 'rotate(-90deg)');

        // create bars for each data point
        svg
            .selectAll('rect')
            .data(gdp)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d[0]))
            .attr('y', (d) => yScale(d[1]))
            .attr('width', (svgWidth - 2 * padding) / gdp.length)
            .attr('height', (d) => yScale(0) - yScale(d[1]))
            .attr('class', 'bar')
            .attr('data-date', (d) => moment(d[0]).format('YYYY-MM-DD'))
            .attr('data-gdp', (d) => d[1])

            // show tooltip on bar:hover
            .on('mouseover', (event, d) => {
                const tooltip = d3.select('#tooltip');
                tooltip
                    .style('display', 'block')
                    .style('left', xScale(d[0]) + 20 + 'px')
                    .text(`Date: ${moment(d[0]).format('YYYY-MM-DD')} Value: ${d[1]}`)
                    .attr('data-date', moment(d[0]).format('YYYY-MM-DD'));
            })
            .on('mouseout', (event, d) => {
                const tooltip = d3.select('#tooltip');
                tooltip.style('display', 'none');
            });
    })
    .catch((error) => console.log(error));
