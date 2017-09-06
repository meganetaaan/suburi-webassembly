#[derive(Debug)]
struct Rand {
    seed: u32,
}

const RAND_MAX: u32 = 0xffff_ffff;

impl Rand {
    fn new(x: u32) -> Rand {
        Rand { seed: x }
    }

    fn rand(&mut self) -> u32 {
        let x = self.seed as u64;
        self.seed = ((69069 * x + 1) & RAND_MAX as u64) as u32;
        self.seed
    }

    fn random(&mut self) -> f64 {
        (1.0 / (RAND_MAX as f64 + 1.0)) * self.rand() as f64
    }
}

#[derive(Debug)]
struct Maze {
    rand: Rand,
    lx: usize,
    ly: usize,
    bond_h: Vec<bool>,
    bond_v: Vec<bool>,
    point: Vec<usize>,
}

impl Maze {
    pub fn new(x: usize, seed: u32) -> Self{
        // 縦、横のサイズが同じ前提
        let rand = Rand::new(seed);
        let size = (x + 1) * x;
        let point_size = x * x * 2;

        let mut bond_h = Vec::with_capacity(size);
        for _ in 0..size {
            bond_h.push(false);
        }
        let mut bond_v = Vec::with_capacity(size);
        for _ in 0..size {
            bond_v.push(false);
        }
        let mut point = Vec::with_capacity(size);
        for i in 0..point_size {
            point.push(i);
        }

        let mut maze: Maze = Maze {
            rand: rand,
            lx: x,
            ly: x,
            bond_h: bond_h,
            bond_v: bond_v,
            point: point,
        }; 
        maze.make_maze();
        maze
    }

    fn get_claster_index(&mut self, x: usize, y: usize) -> usize {
        let mut index: usize = self.lx * y + x;
        while index != self.point[index] {
            index = self.point[index]
        }
        index
    }

    fn connect(&mut self, ix1: usize, iy1: usize, ix2: usize, iy2: usize) {
        let i1: usize = self.get_claster_index(ix1, iy1);
        let i2: usize = self.get_claster_index(ix2, iy2);
        if i1 < i2 {
            self.point[i2] = i1;
        } else {
            self.point[i1] = i2;
        }
    }

    fn make_maze_sub(&mut self, rate: f64) {
        // 横方向に通路を開ける
        for iy in 0 .. self.ly {
            for ix in 0 .. self.lx - 1 {
                let rand: f64 = self.rand.random();
                if rand < rate || self.get_claster_index(ix, iy) == self.get_claster_index(ix + 1, iy) {
                    continue;
                }
                self.bond_h[self.lx * iy + iy + ix + 1] = true;
                self.connect(ix, iy, ix + 1, iy);
            }
        }
        // 縦方向に通路を開ける
        for iy in 0 .. self.ly - 1 {
            for ix in 0 .. self.lx {
                let rand: f64 = self.rand.random();
                let rate: f64 = 0.8;
                if rand < rate || self.get_claster_index(ix, iy) == self.get_claster_index(ix, iy + 1) {
                    continue;
                }
                // TODO: メソッドに切り出す
                self.bond_v[(iy + 1) * self.lx + ix] = true;
                self.connect(ix, iy, ix, iy + 1);
            }
        }
    }

    fn make_maze(&mut self) {
        for _ in 0 .. 10 {
            self.make_maze_sub(0.8);
        }

        // つながっていないクラスタを必ず繋げる
        self.make_maze_sub(1.0);

        // 入り口と出口を開ける
        self.bond_h[0] = true;
        self.bond_h[(self.lx + 1) * self.ly - 1] = true;
    }

    fn print(&mut self) {
        let vwall: char = '-';
        let hwall: char = '|';
        let cross: char = '+';
        let space: char = ' ';

        let mut hdisp: Vec<String> = Vec::new();
        for iy in 0..self.ly {
            let mut s = String::new();
            for ix in 0..self.lx + 1{
                let is_wall: bool = self.bond_h[iy * (self.lx + 1) + ix]; 
                let c: char = if is_wall {
                    space
                } else {
                    hwall
                };
                s.push(c);
                if ix < self.lx {
                    s.push(space);
                }
            }
            hdisp.push(s);
        }
        let mut vdisp: Vec<String> = Vec::new();
        for iy in 0..self.ly + 1{
            let mut s = String::new();
            for ix in 0..self.lx{
                let c: char = match self.bond_v[self.lx * iy + ix] {
                    true => space,
                    _ => vwall
                };
                s.push(cross);
                s.push(c);
                if ix == self.lx - 1{
                    s.push(cross);
                }
            }
            vdisp.push(s);
        }
        for i in 0..vdisp.len() {
            println!("{}", vdisp[i]);
            if i < vdisp.len() - 1 {
                println!("{}", hdisp[i]);
            }
        }
    }
}

fn main() {
    let mut maze: Maze = Maze::new(80, 0);
    maze.print();
}