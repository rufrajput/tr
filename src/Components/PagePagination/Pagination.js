import React from 'react';
import {Link} from 'react-router-dom';

const Pagination = ({postsPerPage , totalPosts , paginate}) => {

    const pageNumber = [];

    for(let i=1 ;  i<= Math.ceil(totalPosts / postsPerPage); i++){
        pageNumber.push(i);
    }

    return(
        <>
  <div className="pagination-area">
                  <ul>
                      {pageNumber.map( number => (
                    <li key={number}>
                        <Link onClick = {() => paginate(number)} href="!#">{number}</Link></li>
                    ))}
                    </ul>
                </div>

        </>
    )
}

export default Pagination;