import React, {Component, Suspense} from 'react';
import Modelizer from 'Core/Modelizer';
import Loading from 'katolika/Loading';
import './church';
import './room';
import '../Day';

class UserList extends Component
{
    static id = 'User.List';
    render() {
        const It = React.lazy(()=>import('katolika/User/List'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}
Modelizer(UserList)

class UserForm extends Component
{
    static id = 'User.Form';
    render() {
        const It = React.lazy(()=>import('katolika/User/Form'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}
Modelizer(UserForm)

class MassChecklist extends Component
{
    static id = 'Mass.Checklist';
    render() {
        const It = React.lazy(()=>import('katolika/Mass/Checklist'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}
Modelizer(MassChecklist)

class Event extends Component
{
    static id = "Event.Schedule.Form";
    render() {
        const It = React.lazy(()=>import('katolika/Event/Schedule/Form'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(Event)

class Liturgy extends Component
{
    static id = "Mass.Liturgy";
    render() {
        const It = React.lazy(()=>import('katolika/Mass/Liturgy'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(Liturgy)

class RichFeed extends Component
{
    static id = "RichFeed";
    render() {
        const It = React.lazy(()=>import('katolika/Feed/Rich'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(RichFeed)

class PrayerLiturgy extends Component
{
    static id = "Prayer.Liturgy";
    render() {
        const It = React.lazy(()=>import('katolika/Mass/Liturgy'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(PrayerLiturgy)

class SongForm extends Component
{
    static id = "Song.Form";
    render() {
        const It = React.lazy(()=>import('katolika/Song/Form'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(SongForm)
class FirstEngageForm extends Component
{
    static id = "FirstEngageForm";
    render() {
        const It = React.lazy(()=>import('katolika/Feed/Form1'))
        return <Suspense fallback={<Loading/>}>
            <It data={this.props.data}/>
        </Suspense>
    }
}

Modelizer(FirstEngageForm)