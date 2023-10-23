'use client'

import React, { Component } from 'react';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

class Pagination extends Component {
    render() {
        let pages = []
        for(let i = 1; i <= this.props.data.last; i++) {
            pages.push(i)
        }
        return pages.length>1 && (
            <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                <div className="-mt-px flex w-0 flex-1">
                    {this.props.data.previous && <a
                        href={`${this.props.root}?page=${this.props.data.previous}`}
                        className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Précédent
                    </a>}
                </div>
                <div className="md:-mt-px md:flex">
                    {pages.map((page, pageIndex)=><a key={pageIndex}
                        href={`${this.props.root}?page=${page}`}
                        className={`inline-flex items-center border-t-2 ${page==this.props.data.current?'border-indigo-500 text-indigo-600':'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-4 pt-4 text-sm font-medium`}
                    >
                        {page}
                    </a>)}
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                    {this.props.data.next && <a
                        href={`${this.props.root}?page=${this.props.data.next}`}
                        className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        Suivant
                        <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </a>}
                </div>
            </nav>
        )
    }
}

export default Pagination