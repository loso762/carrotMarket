import classes from './ProductList.module.css';
import ProductItem from './ProductItem';
import Link from 'next/link';

function ProductList({list,section}) {

  const Productlist = Object.entries(list);

  return (
    <>
    <ul className={classes.list}>
      {Productlist.map((Item) => (
        <ProductItem
          key={Item[0]}
          id={Item[0]}
          image={Item[1].img}
          title={Item[1].title}
          price={Item[1].price}
          time={Item[1].time}
          dong={Item[1].dong}
          category={Item[1].category}
          section={section}
        />
      ))}
    </ul>
    <Link 
      href="NewProduct" 
      className={classes.writeButton}> + 글쓰기
    </Link>
    </>
  );
}

export default ProductList;
