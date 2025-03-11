This year's annual budget involved a discussion on ```N``` sectors where the i th sector was initially allocated an amount ```A``` i.
It was later realised that a minimum budget of ```X``` is required by each sector.

Allocation can be transferred from sector 
```i``` to any sector ```j``` only if the final allocation for sector ```i``` remains **at least** ```X```.

Find the **maximum** number of sectors that can meet the minimum required budget of ```X``` after possible transfers.

### Input Format

-  First line of input contains ```N``` and ```X``` - the number of sectors and the minimum budget requirement of each sector, respectively.
-  Second line consists of ```N``` comma separated integers of ```A``` denoting the initial budget allocated to each sector. 

### Output Format

- Return **maximum** number of sectors that can meet the minimum required budget of X after possible transfers.